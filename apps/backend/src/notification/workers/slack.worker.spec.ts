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
    mockDeliveryService.findById.mockResolvedValue({
      id: 2,
      status: 'PENDING',
      retryCount: 0,
    });
  });

  describe('handleSlackNotification', () => {
    const mockJobData = {
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
    };

    const mockJob = {
      data: mockJobData,
      id: 'slack-job-1',
      attemptsMade: 1,
    } as Job;

    const mockSlackMessage = {
      text: '🏢 *Apple (AAPL)* 실적이 업데이트되었습니다!\n\n📊 *EPS*: $1.10 → $1.25\n💰 *매출*: $480M → $500M',
    };

    it('슬랙 메시지 전송이 성공하면 상태를 SENT로 업데이트해야 한다', async () => {
      // Mock 설정
      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

      // 실행
      await worker.handleSlackNotification(mockJob);

      // 검증
      expect(mockBuildNotificationMessages).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: mockJobData.currentData,
        previousData: mockJobData.previousData,
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

    it('슬랙 메시지 전송이 실패하면 상태를 FAILED로 업데이트하고 에러를 다시 던져야 한다', async () => {
      // Mock 설정
      const testError = new Error('Slack webhook failed');

      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      mockSlackService.sendNotificationMessage.mockRejectedValue(testError);

      // 실행 및 검증
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

    it('Slack rate limit 에러를 올바르게 처리해야 한다', async () => {
      // Mock 설정
      const rateLimitError = new Error('rate_limited');

      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      mockSlackService.sendNotificationMessage.mockRejectedValue(
        rateLimitError,
      );

      // 실행 및 검증
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

    it('Slack webhook URL 무효 에러를 올바르게 처리해야 한다', async () => {
      // Mock 설정
      const invalidUrlError = new Error('invalid_payload');

      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      mockSlackService.sendNotificationMessage.mockRejectedValue(
        invalidUrlError,
      );

      // 실행 및 검증
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

    it('메시지 빌더가 실패하면 에러를 처리해야 한다', async () => {
      // Mock 설정
      const builderError = new Error('메시지 빌더 실패');
      mockBuildNotificationMessages.mockImplementation(() => {
        throw builderError;
      });

      // 실행 및 검증
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

    it('실적 알림 메시지를 올바르게 처리해야 한다', async () => {
      const earningsJobData = {
        ...mockJobData,
        contentType: ContentType.EARNINGS,
        currentData: {
          actualEPS: '1.25',
          actualRevenue: '500M',
          company: { name: 'Apple', ticker: 'AAPL' },
        },
        previousData: {
          actualEPS: '1.10',
          actualRevenue: '480M',
          company: { name: 'Apple', ticker: 'AAPL' },
        },
      };

      const earningsJob = { ...mockJob, data: earningsJobData } as Job;

      // 실제 메시지 빌더를 호출하여 예상 메시지 생성
      const { buildNotificationMessages: actualBuilder } = jest.requireActual(
        '../message-builders',
      );
      const expectedMessages = actualBuilder({
        contentType: ContentType.EARNINGS,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: earningsJobData.currentData,
        previousData: earningsJobData.previousData,
        userId: 456,
      });

      // Mock 설정 - 실제 메시지 빌더 결과 사용
      mockBuildNotificationMessages.mockReturnValue(expectedMessages);

      mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

      // 실행
      await worker.handleSlackNotification(earningsJob);

      // 검증 - 실제 생성된 메시지가 SlackService로 전달되었는지 확인
      expect(mockSlackService.sendNotificationMessage).toHaveBeenCalledWith({
        webhookUrl: 'https://hooks.slack.com/services/test/webhook',
        text: expectedMessages.slack.text,
        blocks: expectedMessages.slack.blocks,
      });

      // 메시지 내용 검증
      expect(expectedMessages.slack.text).toContain('Apple (AAPL)');
      expect(expectedMessages.slack.text).toContain('실적 정보 변경');

      // blocks 내용 검증
      const sectionBlock = expectedMessages.slack.blocks?.find(
        (block) => block.type === 'section',
      );
      expect(sectionBlock?.text?.text).toContain('📊 EPS: 1.10 → 1.25');
      expect(sectionBlock?.text?.text).toContain('💰 매출: 480M → 500M');
    });

    it('배당 알림 메시지를 올바르게 처리해야 한다', async () => {
      const dividendJobData = {
        ...mockJobData,
        contentType: ContentType.DIVIDEND,
        currentData: {
          dividendAmount: '0.25',
          paymentDate: '2024-12-27',
          company: { name: 'Apple', ticker: 'AAPL' },
        },
        previousData: {
          dividendAmount: '0.24',
          paymentDate: '2024-09-27',
          company: { name: 'Apple', ticker: 'AAPL' },
        },
      };

      const dividendJob = { ...mockJob, data: dividendJobData } as Job;

      // 실제 메시지 빌더를 호출하여 예상 메시지 생성
      const { buildNotificationMessages: actualBuilder } = jest.requireActual(
        '../message-builders',
      );
      const expectedMessages = actualBuilder({
        contentType: ContentType.DIVIDEND,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: dividendJobData.currentData,
        previousData: dividendJobData.previousData,
        userId: 456,
      });

      // Mock 설정 - 실제 메시지 빌더 결과 사용
      mockBuildNotificationMessages.mockReturnValue(expectedMessages);

      mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

      // 실행
      await worker.handleSlackNotification(dividendJob);

      // 검증 - 실제 생성된 메시지가 SlackService로 전달되었는지 확인
      expect(mockSlackService.sendNotificationMessage).toHaveBeenCalledWith({
        webhookUrl: 'https://hooks.slack.com/services/test/webhook',
        text: expectedMessages.slack.text,
        blocks: expectedMessages.slack.blocks,
      });

      // 메시지 내용 검증
      expect(expectedMessages.slack.text).toContain('Apple (AAPL)');
      expect(expectedMessages.slack.text).toContain('배당 정보 변경');

      // blocks 내용 검증
      const sectionBlock = expectedMessages.slack.blocks?.find(
        (block) => block.type === 'section',
      );
      expect(sectionBlock?.text?.text).toMatch(/배당금.*0\.24.*→.*0\.25/);
    });

    it('경제지표 알림 메시지를 올바르게 처리해야 한다', async () => {
      const indicatorJobData = {
        ...mockJobData,
        contentType: ContentType.ECONOMIC_INDICATOR,
        currentData: {
          actual: '3.2',
          previous: '3.0',
          name: 'CPI',
          country: 'USA',
        },
        previousData: {
          actual: '3.0',
          previous: '2.8',
          name: 'CPI',
          country: 'USA',
        },
      };

      const indicatorJob = { ...mockJob, data: indicatorJobData } as Job;

      // 실제 메시지 빌더를 호출하여 예상 메시지 생성
      const { buildNotificationMessages: actualBuilder } = jest.requireActual(
        '../message-builders',
      );
      const expectedMessages = actualBuilder({
        contentType: ContentType.ECONOMIC_INDICATOR,
        notificationType: NotificationType.DATA_CHANGED,
        currentData: indicatorJobData.currentData,
        previousData: indicatorJobData.previousData,
        userId: 456,
      });

      // Mock 설정 - 실제 메시지 빌더 결과 사용
      mockBuildNotificationMessages.mockReturnValue(expectedMessages);

      mockSlackService.sendNotificationMessage.mockResolvedValue(undefined);

      // 실행
      await worker.handleSlackNotification(indicatorJob);

      // 검증 - 실제 생성된 메시지가 SlackService로 전달되었는지 확인
      expect(mockSlackService.sendNotificationMessage).toHaveBeenCalledWith({
        webhookUrl: 'https://hooks.slack.com/services/test/webhook',
        text: expectedMessages.slack.text,
        blocks: expectedMessages.slack.blocks,
      });

      // 메시지 내용 검증
      expect(expectedMessages.slack.text).toContain('[USA] CPI');
      expect(expectedMessages.slack.text).toContain('정보 변경');

      // blocks 내용 검증
      const sectionBlock = expectedMessages.slack.blocks?.find(
        (block) => block.type === 'section',
      );
      expect(sectionBlock?.text?.text).toMatch(/실제.*3\.0.*→.*3\.2/);
    });

    it('처리 시간을 정확하게 측정해야 한다', async () => {
      // Mock 설정
      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      // 슬랙 전송을 50ms 지연시킴
      mockSlackService.sendNotificationMessage.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 50)),
      );

      const startTime = Date.now();
      await worker.handleSlackNotification(mockJob);
      const endTime = Date.now();

      // 처리 시간이 40ms 이상이어야 함 (CI 환경 고려하여 여유 있게 설정)
      const expectedMinTime = 40;
      const actualTime = endTime - startTime;
      expect(actualTime).toBeGreaterThanOrEqual(expectedMinTime);

      // updateToSent에 전달된 processingTime 확인
      expect(mockDeliveryService.updateToSent).toHaveBeenCalledWith(
        2,
        expect.any(Number),
      );

      const processingTime = (mockDeliveryService.updateToSent as jest.Mock)
        .mock.calls[0][1];
      expect(processingTime).toBeGreaterThanOrEqual(expectedMinTime);
    });

    it('여러 번 재시도한 후 최종 실패를 올바르게 처리해야 한다', async () => {
      const jobWithRetries = {
        ...mockJob,
        attemptsMade: 3, // 3번째 시도
      } as Job;

      const testError = new Error('Persistent Slack error');

      // 이미 2번 실패한 상태로 설정
      mockDeliveryService.findById.mockResolvedValue({
        id: 2,
        status: 'FAILED',
        retryCount: 2, // 이미 2번 실패
      });

      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      mockSlackService.sendNotificationMessage.mockRejectedValue(testError);

      // 실행 및 검증
      await expect(
        worker.handleSlackNotification(jobWithRetries),
      ).rejects.toThrow('Persistent Slack error');

      expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
        2,
        3, // 3번째 시도 기록 (2 + 1)
        testError, // Error 객체
        expect.any(Number),
      );
    });

    it('SlackService에서 웹훅 URL 검증 실패 시 올바르게 처리해야 한다', async () => {
      // Mock 설정 - SlackService에서 웹훅 URL 검증 실패로 BadRequestException 발생
      const validationError = new Error('입력이 올바르지 않습니다.');

      mockBuildNotificationMessages.mockReturnValue({
        email: { subject: 'test', html: 'test' },
        slack: mockSlackMessage,
      });

      mockSlackService.sendNotificationMessage.mockRejectedValue(
        validationError,
      );

      // 실행 및 검증
      await expect(worker.handleSlackNotification(mockJob)).rejects.toThrow(
        '입력이 올바르지 않습니다.',
      );

      expect(mockSlackService.sendNotificationMessage).toHaveBeenCalledWith({
        webhookUrl: 'https://hooks.slack.com/services/test/webhook',
        text: mockSlackMessage.text,
      });

      expect(mockDeliveryService.updateToFailed).toHaveBeenCalledWith(
        2,
        1,
        validationError,
        expect.any(Number),
      );
    });
  });
});
