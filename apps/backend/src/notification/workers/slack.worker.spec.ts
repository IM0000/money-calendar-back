import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { SlackWorker } from './slack.worker';
import { SlackService } from '../../slack/slack.service';
import { NotificationDeliveryService } from '../notification-delivery.service';
import { buildNotificationMessages } from '../message-builders';
import { ContentType, NotificationType } from '@prisma/client';

// Message builder Mock
jest.mock('../message-builders', () => ({
  buildNotificationMessages: jest.fn(),
}));

describe('SlackWorker', () => {
  let worker: SlackWorker;
  let slackService: SlackService;
  let deliveryService: NotificationDeliveryService;

  // 테스트 데이터 팩토리 함수들
  const createJobData = (overrides = {}) => ({
    deliveryId: 2,
    notificationId: 123,
    userId: 456,
    userEmail: 'test@example.com',
    contentType: ContentType.EARNINGS,
    contentId: 789,
    notificationType: NotificationType.DATA_CHANGED,
    currentData: { actualEPS: '1.25', actualRevenue: '500M' },
    previousData: { actualEPS: '1.10', actualRevenue: '480M' },
    userSettings: {
      emailEnabled: false,
      slackEnabled: true,
      slackWebhookUrl: 'https://hooks.slack.com/services/test/webhook',
      notificationsEnabled: true,
    },
    ...overrides,
  });

  const createMockJob = (data = {}, overrides = {}) =>
    ({
      data: createJobData(data),
      id: 'slack-job-1',
      attemptsMade: 1,
      ...overrides,
    } as Job);

  const createMockDelivery = (overrides = {}) => ({
    id: 2,
    status: 'PENDING',
    retryCount: 0,
    ...overrides,
  });

  const createSlackMessage = (overrides = {}) => ({
    text: '🏢 *Apple (AAPL)* 실적이 업데이트되었습니다!\n\n📊 *EPS*: $1.10 → $1.25\n💰 *매출*: $480M → $500M',
    ...overrides,
  });

  const mockSlackService = {
    sendNotificationMessage: jest.fn(),
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
        SlackWorker,
        {
          provide: SlackService,
          useValue: mockSlackService,
        },
        {
          provide: NotificationDeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    worker = module.get<SlackWorker>(SlackWorker);
    slackService = module.get<SlackService>(SlackService);
    deliveryService = module.get<NotificationDeliveryService>(
      NotificationDeliveryService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    // 기본 Mock 설정
    mockDeliveryService.findById.mockResolvedValue(createMockDelivery());
  });

  describe('슬랙 알림 처리 기능', () => {
    describe('handleSlackNotification', () => {
      it('슬랙 메시지 전송이 성공하면 상태를 SENT로 업데이트해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const mockSlackMessage = createSlackMessage();

        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

        // Act
        await worker.handleSlackNotification(mockJob);

        // Assert
        expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
          contentType: ContentType.EARNINGS,
          notificationType: NotificationType.DATA_CHANGED,
          currentData: mockJob.data.currentData,
          previousData: mockJob.data.previousData,
          userId: 456,
        });

        expect(mockSlackService.sendNotificationMessage).toHaveBeenCalledWith({
          webhookUrl: 'https://hooks.slack.com/services/test/webhook',
          text: mockSlackMessage.text,
        });

        expect(mockDeliveryService.updateToSent).toHaveBeenCalledWith(
          2,
          expect.any(Number), // processingTime
        );

        expect(mockDeliveryService.updateToFailed).not.toHaveBeenCalled();
      });

      it('슬랙 메시지 전송이 실패하면 상태를 FAILED로 업데이트하고 에러를 다시 던져야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const testError = new Error('Slack webhook failed');
        const mockSlackMessage = createSlackMessage();

        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockRejectedValue(testError);

        // Act & Assert
        await expect(worker.handleSlackNotification(mockJob)).rejects.toThrow(
          'Slack webhook failed',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          2,
          1, // newRetryCount (delivery.retryCount + 1)
          testError, // Error 객체
          expect.any(Number), // processingTime
        );

        expect(mockDeliveryService.updateToSent).not.toHaveBeenCalled();
      });

      it('Slack rate limit 에러를 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const rateLimitError = new Error('rate_limited');
        const mockSlackMessage = createSlackMessage();

        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockRejectedValue(
          rateLimitError,
        );

        // Act & Assert
        await expect(worker.handleSlackNotification(mockJob)).rejects.toThrow(
          'rate_limited',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          2,
          1,
          rateLimitError, // Error 객체
          expect.any(Number),
        );
      });

      it('Slack webhook URL 무효 에러를 올바르게 처리해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const invalidUrlError = new Error('invalid_payload');
        const mockSlackMessage = createSlackMessage();

        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockRejectedValue(
          invalidUrlError,
        );

        // Act & Assert
        await expect(worker.handleSlackNotification(mockJob)).rejects.toThrow(
          'invalid_payload',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          2,
          1,
          invalidUrlError, // Error 객체
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
        await expect(worker.handleSlackNotification(mockJob)).rejects.toThrow(
          '메시지 빌더 실패',
        );

        expect(mockSlackService.sendNotificationMessage).not.toHaveBeenCalled();
        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          2,
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
        const mockSlackMessage = createSlackMessage({
          text: '💰 *Apple (AAPL)* 배당이 업데이트되었습니다!\n\n📊 *배당금*: $0.20 → $0.25\n📈 *수익률*: 1.8% → 2.1%',
        });

        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

        // Act
        await worker.handleSlackNotification(mockJob);

        // Assert
        expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
          contentType: ContentType.DIVIDEND,
          notificationType: NotificationType.DATA_CHANGED,
          currentData: dividendJobData.currentData,
          previousData: dividendJobData.previousData,
          userId: 456,
        });

        expect(mockSlackService.sendNotificationMessage).toHaveBeenCalledWith({
          webhookUrl: 'https://hooks.slack.com/services/test/webhook',
          text: mockSlackMessage.text,
        });

        expect(mockDeliveryService.updateToSent).toHaveBeenCalled();
      });

      it('다시 시도 횟수가 증가해야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const mockDelivery = createMockDelivery({ retryCount: 3 });
        const testError = new Error('임시 에러');
        const mockSlackMessage = createSlackMessage();

        mockDeliveryService.findById.mockResolvedValue(mockDelivery);
        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockRejectedValue(testError);

        // Act & Assert
        await expect(worker.handleSlackNotification(mockJob)).rejects.toThrow(
          '임시 에러',
        );

        expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
          2,
          4, // newRetryCount (delivery.retryCount + 1)
          testError,
          expect.any(Number),
        );
      });

      it('처리 시간이 측정되어야 합니다', async () => {
        // Arrange
        const mockJob = createMockJob();
        const mockSlackMessage = createSlackMessage();

        mockBuildNotificationMessages.mockReturnValue({
          email: { subject: 'test', html: 'test' },
          slack: mockSlackMessage,
        });
        mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

        // Act
        await worker.handleSlackNotification(mockJob);

        // Assert
        expect(mockDeliveryService.updateToSent).toHaveBeenCalledWith(
          2,
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
