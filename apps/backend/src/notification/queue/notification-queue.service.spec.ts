import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { NotificationQueueService } from './notification-queue.service';
import {
  EMAIL_QUEUE_NAME,
  SLACK_QUEUE_NAME,
  NotificationJobType,
} from './notification-queue.constants';
import {
  ContentType,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

describe('NotificationQueueService', () => {
  let service: NotificationQueueService;
  let mockEmailQueue: any;
  let mockSlackQueue: any;
  let mockPrisma: any;

  // 테스트 데이터 팩토리 함수들
  const createJobData = (overrides = {}) => ({
    notificationId: 1,
    userId: 1,
    userEmail: 'test@example.com',
    contentType: ContentType.DIVIDEND,
    contentId: 123,
    notificationType: NotificationType.DATA_CHANGED,
    userSettings: {
      emailEnabled: true,
      slackEnabled: false,
      notificationsEnabled: true,
    },
    ...overrides,
  });

  const createUserSettings = (overrides = {}) => ({
    emailEnabled: false,
    slackEnabled: false,
    slackWebhookUrl: null,
    notificationsEnabled: true,
    ...overrides,
  });

  const createMockDelivery = (id = 1) => ({ id });

  const createQueueMocks = () => ({
    add: jest.fn(),
    getWaiting: jest.fn().mockResolvedValue([]),
    getActive: jest.fn().mockResolvedValue([]),
    getCompleted: jest.fn().mockResolvedValue([]),
    getFailed: jest.fn().mockResolvedValue([]),
  });

  beforeEach(async () => {
    // 이메일 큐 Mock
    mockEmailQueue = createQueueMocks();

    // 슬랙 큐 Mock
    mockSlackQueue = createQueueMocks();

    // Prisma Mock
    mockPrisma = {
      notificationDelivery: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationQueueService,
        {
          provide: getQueueToken(EMAIL_QUEUE_NAME),
          useValue: mockEmailQueue,
        },
        {
          provide: getQueueToken(SLACK_QUEUE_NAME),
          useValue: mockSlackQueue,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<NotificationQueueService>(NotificationQueueService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    // Assert
    expect(service).toBeDefined();
  });

  describe('알림 작업 추가 기능', () => {
    describe('addNotificationJob', () => {
      it('이메일이 활성화된 경우 이메일 큐에 작업을 추가해야 합니다', async () => {
        // Arrange
        const mockDelivery = createMockDelivery(1);
        mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);
        const jobData = createJobData({
          userSettings: createUserSettings({ emailEnabled: true }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockPrisma.notificationDelivery.create).toHaveBeenCalledWith({
          data: {
            notificationId: 1,
            channelKey: NotificationChannel.EMAIL,
            status: NotificationStatus.PENDING,
            retryCount: 0,
          },
        });

        expect(mockEmailQueue.add).toHaveBeenCalledWith(
          NotificationJobType.SEND_EMAIL,
          expect.objectContaining({
            notificationId: 1,
            userId: 1,
            userEmail: 'test@example.com',
            contentType: ContentType.DIVIDEND,
            contentId: 123,
            notificationType: NotificationType.DATA_CHANGED,
            deliveryId: 1,
          }),
        );

        expect(mockSlackQueue.add).not.toHaveBeenCalled();
      });

      it('슬랙이 활성화된 경우 슬랙 큐에 작업을 추가해야 합니다', async () => {
        // Arrange
        const mockDelivery = createMockDelivery(2);
        mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);
        const jobData = createJobData({
          contentType: ContentType.EARNINGS,
          contentId: 456,
          userSettings: createUserSettings({
            slackEnabled: true,
            slackWebhookUrl: 'https://hooks.slack.com/test',
          }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockPrisma.notificationDelivery.create).toHaveBeenCalledWith({
          data: {
            notificationId: 1,
            channelKey: NotificationChannel.SLACK,
            status: NotificationStatus.PENDING,
            retryCount: 0,
          },
        });

        expect(mockSlackQueue.add).toHaveBeenCalledWith(
          NotificationJobType.SEND_SLACK,
          expect.objectContaining({
            notificationId: 1,
            userId: 1,
            userEmail: 'test@example.com',
            contentType: ContentType.EARNINGS,
            contentId: 456,
            notificationType: NotificationType.DATA_CHANGED,
            deliveryId: 2,
          }),
        );

        expect(mockEmailQueue.add).not.toHaveBeenCalled();
      });

      it('이메일과 슬랙이 모두 활성화된 경우 두 큐 모두에 작업을 추가해야 합니다', async () => {
        // Arrange
        const mockEmailDelivery = createMockDelivery(1);
        const mockSlackDelivery = createMockDelivery(2);
        mockPrisma.notificationDelivery.create
          .mockResolvedValueOnce(mockEmailDelivery)
          .mockResolvedValueOnce(mockSlackDelivery);

        const jobData = createJobData({
          contentType: ContentType.EARNINGS,
          contentId: 456,
          userSettings: createUserSettings({
            emailEnabled: true,
            slackEnabled: true,
            slackWebhookUrl: 'https://hooks.slack.com/test',
          }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockEmailQueue.add).toHaveBeenCalledWith(
          NotificationJobType.SEND_EMAIL,
          expect.objectContaining({ deliveryId: 1 }),
        );
        expect(mockSlackQueue.add).toHaveBeenCalledWith(
          NotificationJobType.SEND_SLACK,
          expect.objectContaining({ deliveryId: 2 }),
        );

        expect(mockPrisma.notificationDelivery.create).toHaveBeenCalledTimes(2);
      });

      it('알림이 비활성화된 경우 작업을 추가하지 않아야 합니다', async () => {
        // Arrange
        const jobData = createJobData({
          userSettings: createUserSettings({
            emailEnabled: true,
            slackEnabled: true,
            slackWebhookUrl: 'https://hooks.slack.com/test',
            notificationsEnabled: false, // 전체 알림 비활성화
          }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockEmailQueue.add).not.toHaveBeenCalled();
        expect(mockSlackQueue.add).not.toHaveBeenCalled();
        expect(mockPrisma.notificationDelivery.create).not.toHaveBeenCalled();
      });

      it('슬랙 웹훅 URL이 없으면 슬랙 작업을 추가하지 않아야 합니다', async () => {
        // Arrange
        const mockDelivery = createMockDelivery(1);
        mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);
        const jobData = createJobData({
          contentType: ContentType.EARNINGS,
          contentId: 456,
          userSettings: createUserSettings({
            emailEnabled: true,
            slackEnabled: true,
            slackWebhookUrl: null, // 웹훅 URL 없음
          }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockEmailQueue.add).toHaveBeenCalled();
        expect(mockSlackQueue.add).not.toHaveBeenCalled();
      });

      it('이메일과 슬랙이 모두 비활성화된 경우 작업을 추가하지 않아야 합니다', async () => {
        // Arrange
        const jobData = createJobData({
          userSettings: createUserSettings({
            emailEnabled: false,
            slackEnabled: false,
          }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockEmailQueue.add).not.toHaveBeenCalled();
        expect(mockSlackQueue.add).not.toHaveBeenCalled();
        expect(mockPrisma.notificationDelivery.create).not.toHaveBeenCalled();
      });

      it('다른 콘텐츠 타입에 대해서도 올바르게 작업을 추가해야 합니다', async () => {
        // Arrange
        const mockDelivery = createMockDelivery(1);
        mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);
        const jobData = createJobData({
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 999,
          notificationType: NotificationType.DATA_CHANGED,
          userSettings: createUserSettings({ emailEnabled: true }),
        });

        // Act
        await service.addNotificationJob(jobData);

        // Assert
        expect(mockEmailQueue.add).toHaveBeenCalledWith(
          NotificationJobType.SEND_EMAIL,
          expect.objectContaining({
            contentType: ContentType.ECONOMIC_INDICATOR,
            contentId: 999,
            notificationType: NotificationType.DATA_CHANGED,
          }),
        );
      });
    });
  });

  describe('큐 상태 조회 기능', () => {
    describe('getQueueStatus', () => {
      it('이메일과 슬랙 큐의 상태를 반환해야 합니다', async () => {
        // Arrange
        mockEmailQueue.getWaiting.mockResolvedValue([1, 2]);
        mockEmailQueue.getActive.mockResolvedValue([3]);
        mockEmailQueue.getCompleted.mockResolvedValue([4, 5, 6]);
        mockEmailQueue.getFailed.mockResolvedValue([7]);

        mockSlackQueue.getWaiting.mockResolvedValue([1]);
        mockSlackQueue.getActive.mockResolvedValue([]);
        mockSlackQueue.getCompleted.mockResolvedValue([2, 3]);
        mockSlackQueue.getFailed.mockResolvedValue([]);

        // Act
        const status = await service.getQueueStatus();

        // Assert
        expect(status).toEqual({
          email: {
            waiting: 2,
            active: 1,
            completed: 3,
            failed: 1,
          },
          slack: {
            waiting: 1,
            active: 0,
            completed: 2,
            failed: 0,
          },
        });
      });

      it('큐가 비어있는 경우에도 올바른 상태를 반환해야 합니다', async () => {
        // Arrange
        mockEmailQueue.getWaiting.mockResolvedValue([]);
        mockEmailQueue.getActive.mockResolvedValue([]);
        mockEmailQueue.getCompleted.mockResolvedValue([]);
        mockEmailQueue.getFailed.mockResolvedValue([]);

        mockSlackQueue.getWaiting.mockResolvedValue([]);
        mockSlackQueue.getActive.mockResolvedValue([]);
        mockSlackQueue.getCompleted.mockResolvedValue([]);
        mockSlackQueue.getFailed.mockResolvedValue([]);

        // Act
        const status = await service.getQueueStatus();

        // Assert
        expect(status).toEqual({
          email: {
            waiting: 0,
            active: 0,
            completed: 0,
            failed: 0,
          },
          slack: {
            waiting: 0,
            active: 0,
            completed: 0,
            failed: 0,
          },
        });
      });

      it('큐 조회 중 에러가 발생해도 처리해야 합니다', async () => {
        // Arrange
        mockEmailQueue.getWaiting.mockRejectedValue(new Error('Queue error'));

        // Act & Assert
        await expect(service.getQueueStatus()).rejects.toThrow('Queue error');
      });
    });
  });

  describe('실패한 작업 재시도 기능', () => {
    describe('retryFailedJobs', () => {
      it('실패한 작업들을 재시도해야 합니다', async () => {
        // Arrange
        const mockFailedEmailJob = { id: 'email-1', retry: jest.fn() };
        const mockFailedSlackJob = { id: 'slack-1', retry: jest.fn() };

        mockEmailQueue.getFailed.mockResolvedValue([mockFailedEmailJob]);
        mockSlackQueue.getFailed.mockResolvedValue([mockFailedSlackJob]);

        // Act
        const result = await service.retryFailedJobs();

        // Assert
        expect(mockFailedEmailJob.retry).toHaveBeenCalled();
        expect(mockFailedSlackJob.retry).toHaveBeenCalled();
        expect(result).toEqual({
          email: 1,
          slack: 1,
        });
      });

      it('재시도 실패 시 에러를 로깅하지만 계속 진행해야 합니다', async () => {
        // Arrange
        const mockFailedJob1 = {
          id: 'job-1',
          retry: jest.fn().mockRejectedValue(new Error('재시도 실패')),
        };
        const mockFailedJob2 = { id: 'job-2', retry: jest.fn() };

        mockEmailQueue.getFailed.mockResolvedValue([
          mockFailedJob1,
          mockFailedJob2,
        ]);
        mockSlackQueue.getFailed.mockResolvedValue([]);

        // Act
        const result = await service.retryFailedJobs();

        // Assert
        expect(mockFailedJob1.retry).toHaveBeenCalled();
        expect(mockFailedJob2.retry).toHaveBeenCalled();
        expect(result).toEqual({
          email: 1, // 성공한 재시도만 카운트
          slack: 0,
        });
      });

      it('실패한 작업이 없는 경우 0을 반환해야 합니다', async () => {
        // Arrange
        mockEmailQueue.getFailed.mockResolvedValue([]);
        mockSlackQueue.getFailed.mockResolvedValue([]);

        // Act
        const result = await service.retryFailedJobs();

        // Assert
        expect(result).toEqual({
          email: 0,
          slack: 0,
        });
      });

      it('여러 개의 실패한 작업을 모두 재시도해야 합니다', async () => {
        // Arrange
        const mockFailedEmailJobs = [
          { id: 'email-1', retry: jest.fn() },
          { id: 'email-2', retry: jest.fn() },
          { id: 'email-3', retry: jest.fn() },
        ];
        const mockFailedSlackJobs = [
          { id: 'slack-1', retry: jest.fn() },
          { id: 'slack-2', retry: jest.fn() },
        ];

        mockEmailQueue.getFailed.mockResolvedValue(mockFailedEmailJobs);
        mockSlackQueue.getFailed.mockResolvedValue(mockFailedSlackJobs);

        // Act
        const result = await service.retryFailedJobs();

        // Assert
        mockFailedEmailJobs.forEach((job) => {
          expect(job.retry).toHaveBeenCalled();
        });
        mockFailedSlackJobs.forEach((job) => {
          expect(job.retry).toHaveBeenCalled();
        });
        expect(result).toEqual({
          email: 3,
          slack: 2,
        });
      });

      it('일부 재시도가 실패해도 성공한 것만 카운트해야 합니다', async () => {
        // Arrange
        const mockFailedEmailJobs = [
          { id: 'email-1', retry: jest.fn() }, // 성공
          {
            id: 'email-2',
            retry: jest.fn().mockRejectedValue(new Error('실패')),
          }, // 실패
          { id: 'email-3', retry: jest.fn() }, // 성공
        ];

        mockEmailQueue.getFailed.mockResolvedValue(mockFailedEmailJobs);
        mockSlackQueue.getFailed.mockResolvedValue([]);

        // Act
        const result = await service.retryFailedJobs();

        // Assert
        expect(result).toEqual({
          email: 2, // 성공한 재시도만 카운트
          slack: 0,
        });
      });
    });
  });
});
