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
    mockDeliveryService.findById.mockResolvedValue({
      id: 1,
      status: 'PENDING',
      retryCount: 0,
    });
  });

  describe('handleEmailNotification', () => {
    const mockJobData = {
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
    };

    const mockJob = {
      data: mockJobData,
      id: 'email-job-1',
      attemptsMade: 1,
    } as Job;

    const mockMessageData = {
      subject: '실적 알림: Apple 주식',
      html: '<h1>실적이 업데이트되었습니다.</h1>',
    };

    it('이메일 전송이 성공하면 상태를 SENT로 업데이트해야 한다', async () => {
      // Mock 설정
      mockDeliveryService.findById.mockResolvedValue({
        id: 1,
        status: 'PENDING',
        retryCount: 0,
      });

      mockBuildNotificationMessages.mockReturnValue({
        email: mockMessageData,
        slack: { text: 'slack message' },
      });

      mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

      // 실행
      await worker.handleEmailNotification(mockJob);

      // 검증
      expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: mockJobData.currentData,
        previousData: mockJobData.previousData,
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

    it('이메일 전송이 실패하면 상태를 FAILED로 업데이트하고 에러를 다시 던져야 한다', async () => {
      // Mock 설정
      const testError = new Error('Gmail quota exceeded');

      mockBuildNotificationMessages.mockReturnValue({
        email: mockMessageData,
        slack: { text: 'slack message' },
      });

      mockEmailService.sendNotificationEmail.mockRejectedValue(testError);

      // 실행 및 검증
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

    it('AWS SES rate limit 에러를 올바르게 처리해야 한다', async () => {
      // Mock 설정
      const sesError = new Error('Throttling: Rate exceeded');

      mockBuildNotificationMessages.mockReturnValue({
        email: mockMessageData,
        slack: { text: 'slack message' },
      });

      mockEmailService.sendNotificationEmail.mockRejectedValue(sesError);

      // 실행 및 검증
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

    it('Gmail SMTP 할당량 초과 에러를 올바르게 처리해야 한다', async () => {
      // Mock 설정
      const gmailError = new Error('550 5.4.5 Daily sending quota exceeded');

      mockBuildNotificationMessages.mockReturnValue({
        email: mockMessageData,
        slack: { text: 'slack message' },
      });

      mockEmailService.sendNotificationEmail.mockRejectedValue(gmailError);

      // 실행 및 검증
      await expect(worker.handleEmailNotification(mockJob)).rejects.toThrow(
        '550 5.4.5 Daily sending quota exceeded',
      );

      expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
        1,
        1,
        gmailError, // Error 객체
        expect.any(Number),
      );
    });

    it('메시지 빌더가 실패하면 에러를 처리해야 한다', async () => {
      // Mock 설정
      const builderError = new Error('메시지 빌더 실패');
      mockBuildNotificationMessages.mockImplementation(() => {
        throw builderError;
      });

      // 실행 및 검증
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

    it('배당 알림 메시지를 올바르게 처리해야 한다', async () => {
      const dividendJobData = {
        ...mockJobData,
        contentType: ContentType.DIVIDEND,
        currentData: { dividendAmount: '0.25', paymentDate: '2024-12-27' },
        previousData: { dividendAmount: '0.24', paymentDate: '2024-09-27' },
      };

      const dividendJob = { ...mockJob, data: dividendJobData } as Job;

      const dividendMessageData = {
        subject: '배당 알림: Apple 주식',
        html: '<h1>배당이 업데이트되었습니다.</h1>',
      };

      mockBuildNotificationMessages.mockReturnValue({
        email: dividendMessageData,
        slack: { text: 'slack message' },
      });

      mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

      // 실행
      await worker.handleEmailNotification(dividendJob);

      // 검증
      expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
        contentType: ContentType.DIVIDEND,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: dividendJobData.currentData,
        previousData: dividendJobData.previousData,
        userId: 456,
      });

      expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: dividendMessageData.subject,
        html: dividendMessageData.html,
      });
    });

    it('경제지표 알림 메시지를 올바르게 처리해야 한다', async () => {
      const indicatorJobData = {
        ...mockJobData,
        contentType: ContentType.ECONOMIC_INDICATOR,
        currentData: { actual: '3.2', previous: '3.0' },
        previousData: { actual: '3.0', previous: '2.8' },
      };

      const indicatorJob = { ...mockJob, data: indicatorJobData } as Job;

      const indicatorMessageData = {
        subject: '경제지표 알림: CPI 데이터',
        html: '<h1>경제지표가 업데이트되었습니다.</h1>',
      };

      mockBuildNotificationMessages.mockReturnValue({
        email: indicatorMessageData,
        slack: { text: 'slack message' },
      });

      mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

      // 실행
      await worker.handleEmailNotification(indicatorJob);

      // 검증
      expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
        contentType: ContentType.ECONOMIC_INDICATOR,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: indicatorJobData.currentData,
        previousData: indicatorJobData.previousData,
        userId: 456,
      });
    });

    it('처리 시간을 정확하게 측정해야 한다', async () => {
      // Mock 설정
      mockBuildNotificationMessages.mockReturnValue({
        email: mockMessageData,
        slack: { text: 'slack message' },
      });

      // 이메일 전송을 100ms 지연시킴
      mockEmailService.sendNotificationEmail.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const startTime = Date.now();
      await worker.handleEmailNotification(mockJob);
      const endTime = Date.now();

      // 처리 시간이 100ms 이상이어야 함
      const expectedMinTime = 100;
      const actualTime = endTime - startTime;
      expect(actualTime).toBeGreaterThanOrEqual(expectedMinTime);

      // updateToSent에 전달된 processingTime 확인
      expect(mockDeliveryService.updateToSent).toHaveBeenCalledWith(
        1,
        expect.any(Number),
      );

      const processingTime = (mockDeliveryService.updateToSent as jest.Mock)
        .mock.calls[0][1];
      expect(processingTime).toBeGreaterThanOrEqual(expectedMinTime);
    });
  });
});
