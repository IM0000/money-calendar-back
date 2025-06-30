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

  beforeEach(async () => {
    // 이메일 큐 Mock
    mockEmailQueue = {
      add: jest.fn(),
      getWaiting: jest.fn().mockResolvedValue([]),
      getActive: jest.fn().mockResolvedValue([]),
      getCompleted: jest.fn().mockResolvedValue([]),
      getFailed: jest.fn().mockResolvedValue([]),
    };

    // 슬랙 큐 Mock
    mockSlackQueue = {
      add: jest.fn(),
      getWaiting: jest.fn().mockResolvedValue([]),
      getActive: jest.fn().mockResolvedValue([]),
      getCompleted: jest.fn().mockResolvedValue([]),
      getFailed: jest.fn().mockResolvedValue([]),
    };

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

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('addNotificationJob', () => {
    it('이메일이 활성화된 경우 이메일 큐에 작업을 추가해야 한다', async () => {
      const mockDelivery = { id: 1 };
      mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);

      const jobData = {
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
      };

      await service.addNotificationJob(jobData);

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

    it('슬랙이 활성화된 경우 슬랙 큐에 작업을 추가해야 한다', async () => {
      const mockDelivery = { id: 2 };
      mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);

      const jobData = {
        notificationId: 1,
        userId: 1,
        userEmail: 'test@example.com',
        contentType: ContentType.EARNINGS,
        contentId: 456,
        notificationType: NotificationType.DATA_CHANGED,
        userSettings: {
          emailEnabled: false,
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/test',
          notificationsEnabled: true,
        },
      };

      await service.addNotificationJob(jobData);

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

    it('이메일과 슬랙이 모두 활성화된 경우 두 큐 모두에 작업을 추가해야 한다', async () => {
      const mockEmailDelivery = { id: 1 };
      const mockSlackDelivery = { id: 2 };
      mockPrisma.notificationDelivery.create
        .mockResolvedValueOnce(mockEmailDelivery)
        .mockResolvedValueOnce(mockSlackDelivery);

      const jobData = {
        notificationId: 1,
        userId: 1,
        userEmail: 'test@example.com',
        contentType: ContentType.EARNINGS,
        contentId: 456,
        notificationType: NotificationType.DATA_CHANGED,
        userSettings: {
          emailEnabled: true,
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/test',
          notificationsEnabled: true,
        },
      };

      await service.addNotificationJob(jobData);

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

    it('알림이 비활성화된 경우 작업을 추가하지 않아야 한다', async () => {
      const jobData = {
        notificationId: 1,
        userId: 1,
        userEmail: 'test@example.com',
        contentType: ContentType.DIVIDEND,
        contentId: 123,
        notificationType: NotificationType.DATA_CHANGED,
        userSettings: {
          emailEnabled: true,
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/test',
          notificationsEnabled: false, // 전체 알림 비활성화
        },
      };

      await service.addNotificationJob(jobData);

      expect(mockEmailQueue.add).not.toHaveBeenCalled();
      expect(mockSlackQueue.add).not.toHaveBeenCalled();
      expect(mockPrisma.notificationDelivery.create).not.toHaveBeenCalled();
    });

    it('슬랙 웹훅 URL이 없으면 슬랙 작업을 추가하지 않아야 한다', async () => {
      const mockDelivery = { id: 1 };
      mockPrisma.notificationDelivery.create.mockResolvedValue(mockDelivery);

      const jobData = {
        notificationId: 1,
        userId: 1,
        userEmail: 'test@example.com',
        contentType: ContentType.EARNINGS,
        contentId: 456,
        notificationType: NotificationType.DATA_CHANGED,
        userSettings: {
          emailEnabled: true,
          slackEnabled: true,
          slackWebhookUrl: null, // 웹훅 URL 없음
          notificationsEnabled: true,
        },
      };

      await service.addNotificationJob(jobData);

      expect(mockEmailQueue.add).toHaveBeenCalled();
      expect(mockSlackQueue.add).not.toHaveBeenCalled();
    });
  });

  describe('getQueueStatus', () => {
    it('이메일과 슬랙 큐의 상태를 반환해야 한다', async () => {
      // 이메일 큐 상태 Mock
      mockEmailQueue.getWaiting.mockResolvedValue([1, 2]);
      mockEmailQueue.getActive.mockResolvedValue([3]);
      mockEmailQueue.getCompleted.mockResolvedValue([4, 5, 6]);
      mockEmailQueue.getFailed.mockResolvedValue([7]);

      // 슬랙 큐 상태 Mock
      mockSlackQueue.getWaiting.mockResolvedValue([1]);
      mockSlackQueue.getActive.mockResolvedValue([]);
      mockSlackQueue.getCompleted.mockResolvedValue([2, 3]);
      mockSlackQueue.getFailed.mockResolvedValue([]);

      const status = await service.getQueueStatus();

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
  });

  describe('retryFailedJobs', () => {
    it('실패한 작업들을 재시도해야 한다', async () => {
      const mockFailedEmailJob = { id: 'email-1', retry: jest.fn() };
      const mockFailedSlackJob = { id: 'slack-1', retry: jest.fn() };

      mockEmailQueue.getFailed.mockResolvedValue([mockFailedEmailJob]);
      mockSlackQueue.getFailed.mockResolvedValue([mockFailedSlackJob]);

      const result = await service.retryFailedJobs();

      expect(mockFailedEmailJob.retry).toHaveBeenCalled();
      expect(mockFailedSlackJob.retry).toHaveBeenCalled();
      expect(result).toEqual({
        email: 1,
        slack: 1,
      });
    });

    it('재시도 실패 시 에러를 로깅하지만 계속 진행해야 한다', async () => {
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

      const result = await service.retryFailedJobs();

      expect(mockFailedJob1.retry).toHaveBeenCalled();
      expect(mockFailedJob2.retry).toHaveBeenCalled();
      expect(result).toEqual({
        email: 1, // 성공한 재시도만 카운트
        slack: 0,
      });
    });
  });
});
