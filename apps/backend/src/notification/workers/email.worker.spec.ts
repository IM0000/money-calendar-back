import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { EmailWorker } from './email.worker';
import { EmailService } from '../../email/email.service';
import { NotificationDeliveryService } from '../notification-delivery.service';
import { buildNotificationMessages } from '../message-builders';
import {
  ContentType,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@prisma/client';
import { Logger } from '@nestjs/common';

// Message builder Mock
jest.mock('../message-builders', () => ({
  buildNotificationMessages: jest.fn(),
}));

describe('EmailWorker', () => {
  let worker: EmailWorker;
  let emailService: EmailService;
  let deliveryService: NotificationDeliveryService;

  // 테스트 데이터 팩토리 함수들
  const createJobData = (overrides = {}) => ({
    deliveryId: 1,
    notificationId: 123,
    userId: 456,
    userEmail: 'test@example.com',
    contentType: ContentType.EARNINGS,
    contentId: 789,
    notificationType: NotificationType.DATA_CHANGED,
    currentData: { actualEPS: '1.25', actualRevenue: '500M' },
    previousData: { actualEPS: '1.10', actualRevenue: '480M' },
    userSettings: {
      emailEnabled: true,
      slackEnabled: false,
      notificationsEnabled: true,
    },
    ...overrides,
  });

  const createMockJob = (data = {}, overrides = {}) =>
    ({
      data: createJobData(data),
      id: 'email-job-1',
      attemptsMade: 1,
      ...overrides,
    } as Job);

  const createMockDelivery = (overrides = {}) => ({
    id: 1,
    status: 'PENDING',
    retryCount: 0,
    ...overrides,
  });

  const createMessageData = (overrides = {}) => ({
    subject: '실적 알림: Apple 주식',
    html: '<h1>실적이 업데이트되었습니다.</h1>',
    ...overrides,
  });

  const mockEmailService = {
    sendNotificationEmail: jest.fn(),
  };

  const mockDeliveryService = {
    findById: jest.fn(),
    updateToSent: jest.fn(),
    updateToFailed: jest.fn(),
  };

  const mockBuildNotificationMessages =
    buildNotificationMessages as jest.MockedFunction<
      typeof buildNotificationMessages
    >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailWorker,
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: NotificationDeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    worker = module.get<EmailWorker>(EmailWorker);
    emailService = module.get<EmailService>(EmailService);
    deliveryService = module.get<NotificationDeliveryService>(
      NotificationDeliveryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    // 기본 Mock 설정
    mockDeliveryService.findById.mockResolvedValue(createMockDelivery());
  });

  describe('이메일 알림 처리 기능', () => {
    describe('handleEmailNotification', () => {
      it('이메일 전송이 성공하면 상태를 SENT로 업데이트해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const mockDelivery = createMockDelivery();
        const mockMessageData = createMessageData();

        mockDeliveryService.findById.mockResolvedValue(mockDelivery);
        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

        // Act
        await worker.handleEmailNotification(mockJob);

        // Assert
        expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
          contentType: ContentType.EARNINGS,
          notificationType: NotificationType.DATA_CHANGED,
          currentData: mockJob.data.currentData,
          previousData: mockJob.data.previousData,
          userId: 456,
        });

        expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledWith({
          to: 'test@example.com',
          subject: mockMessageData.subject,
          html: mockMessageData.html,
        });

        expect(mockDeliveryService.updateToSent).toHaveBeenCalledWith(
          1,
          expect.any(Number), // processingTime
        );

        expect(mockDeliveryService.updateToFailed).not.toHaveBeenCalled();
      });

      it('이메일 전송이 실패하면 상태를 FAILED로 업데이트하고 에러를 다시 던져야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const testError = new Error('Gmail quota exceeded');
        const mockMessageData = createMessageData();

        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockRejectedValue(testError);

        // Act & Assert
        await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
          'Gmail quota exceeded',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          1,
          1, // newRetryCount (delivery.retryCount + 1)
          testError, // Error 객체
          expect.any(Number), // processingTime
        );

        expect(mockDeliveryService.updateToSent).not.toHaveBeenCalled();
      });

      it('AWS SES rate limit 에러를 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const sesError = new Error('Throttling: Rate exceeded');
        const mockMessageData = createMessageData();

        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockRejectedValue(sesError);

        // Act & Assert
        await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
          'Throttling: Rate exceeded',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          1,
          1,
          sesError, // Error 객체
          expect.any(Number),
        );
      });

      it('Gmail SMTP 할당량 초과 에러를 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const gmailError = new Error('550 5.4.5 Daily sending quota exceeded');
        const mockMessageData = createMessageData();

        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockRejectedValue(gmailError);

        // Act & Assert
        await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
          '550 5.4.5 Daily sending quota exceeded',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          1,
          1,
          gmailError,
          expect.any(Number),
        );
      });

      it('메시지 빌더가 실패하면 에러를 처리해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const builderError = new Error('메시지 빌더 실패');
        mockBuildNotificationMessages.mockImplementation(() => {
          throw builderError;
        });

        // Act & Assert
        await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
          '메시지 빌더 실패',
        );

        expect(mockEmailService.sendNotificationEmail).not.toHaveBeenCalled();
        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          1,
          1,
          builderError, // Error 객체
          expect.any(Number),
        );
      });

      it('다른 콘텐츠 타입의 알림도 올바르게 처리해야 합니다', async () => {
        // Arrange
        const dividendJobData = createJobData({
          contentType: ContentType.DIVIDEND,
          currentData: {
            dividendAmount: '0.25',
            dividendYield: '2.1%',
            company: { name: 'Apple', ticker: 'AAPL' },
          },
          previousData: {
            dividendAmount: '0.20',
            dividendYield: '1.8%',
            company: { name: 'Apple', ticker: 'AAPL' },
          },
        });
        const mockJob = createMockJob(dividendJobData);
        const mockMessageData = createMessageData({
          subject: '배당 알림: Apple 주식',
          html: '<h1>배당 정보가 업데이트되었습니다.</h1>',
        });

        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'dividend slack message' },
        });
        mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

        // Act
        await worker.handleEmailNotification(mockJob);

        // Assert
        expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
          contentType: ContentType.DIVIDEND,
          notificationType: NotificationType.DATA_CHANGED,
          currentData: dividendJobData.currentData,
          previousData: dividendJobData.previousData,
          userId: 456,
        });

        expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledWith({
          to: 'test@example.com',
          subject: '배당 알림: Apple 주식',
          html: '<h1>배당 정보가 업데이트되었습니다.</h1>',
        });

        expect(mockDeliveryService.updateToSent).toHaveBeenCalled();
      });

      it('다시 시도 횟수가 증가해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const mockDelivery = createMockDelivery({ retryCount: 2 });
        const testError = new Error('임시 에러');
        const mockMessageData = createMessageData();

        mockDeliveryService.findById.mockResolvedValue(mockDelivery);
        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockRejectedValue(testError);

        // Act & Assert
        await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
          '임시 에러',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          1,
          3, // newRetryCount (delivery.retryCount + 1)
          testError,
          expect.any(Number),
        );
      });

      it('네트워크 타임아웃 에러를 처리해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const timeoutError = new Error('ETIMEDOUT');
        const mockMessageData = createMessageData();

        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockRejectedValue(timeoutError);

        // Act & Assert
        await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
          'ETIMEDOUT',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          1,
          1,
          timeoutError,
          expect.any(Number),
        );
      });

      it('처리 시간이 측정되어야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const mockMessageData = createMessageData();

        mockBuildNotificationMessages.mockReturnValue({
          email: mockMessageData,
          slack: { text: 'slack message' },
        });
        mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

        // Act
        await worker.handleEmailNotification(mockJob);

        // Assert
        expect(mockDeliveryService.updateToSent).toHaveBeenCalledWith(
          1,
          expect.any(Number), // processingTime이 숫자여야 함
        );

        // 처리 시간이 양수인지 확인
        const processingTime =
          mockDeliveryService.updateToSent.mock.calls[0][1];
        expect(processingTime).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
