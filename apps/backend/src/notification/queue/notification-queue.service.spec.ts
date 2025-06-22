import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { NotificationQueueService } from './notification-queue.service';
import {
  NOTIFICATION_QUEUE_NAME,
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
  let mockQueue: any;
  let mockPrisma: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      getWaiting: jest.fn().mockResolvedValue([]),
      getActive: jest.fn().mockResolvedValue([]),
      getCompleted: jest.fn().mockResolvedValue([]),
      getFailed: jest.fn().mockResolvedValue([]),
    };

    mockPrisma = {
      notificationDelivery: {
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationQueueService,
        {
          provide: getQueueToken(NOTIFICATION_QUEUE_NAME),
          useValue: mockQueue,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<NotificationQueueService>(NotificationQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add notification job to queue with email enabled', async () => {
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

    expect(mockQueue.add).toHaveBeenCalledWith(
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
  });

  it('should get queue status', async () => {
    const status = await service.getQueueStatus();

    expect(status).toEqual({
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
    });

    expect(mockQueue.getWaiting).toHaveBeenCalled();
    expect(mockQueue.getActive).toHaveBeenCalled();
    expect(mockQueue.getCompleted).toHaveBeenCalled();
    expect(mockQueue.getFailed).toHaveBeenCalled();
  });

  it('should add both email and slack jobs when both enabled', async () => {
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

    expect(mockQueue.add).toHaveBeenCalledTimes(2);
    expect(mockQueue.add).toHaveBeenCalledWith(
      NotificationJobType.SEND_EMAIL,
      expect.objectContaining({ deliveryId: 1 }),
    );
    expect(mockQueue.add).toHaveBeenCalledWith(
      NotificationJobType.SEND_SLACK,
      expect.objectContaining({ deliveryId: 2 }),
    );
  });

  it('should not add jobs when notifications disabled', async () => {
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
        notificationsEnabled: false, // 비활성화
      },
    };

    await service.addNotificationJob(jobData);

    expect(mockQueue.add).not.toHaveBeenCalled();
    expect(mockPrisma.notificationDelivery.create).not.toHaveBeenCalled();
  });
});
