import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { NotificationQueueService } from './notification-queue.service';
import {
  NOTIFICATION_QUEUE_NAME,
  NotificationJobType,
} from './notification-queue.constants';
import { ContentType } from '@prisma/client';

describe('NotificationQueueService', () => {
  let service: NotificationQueueService;
  let mockQueue: any;

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(),
      getWaiting: jest.fn().mockResolvedValue([]),
      getActive: jest.fn().mockResolvedValue([]),
      getCompleted: jest.fn().mockResolvedValue([]),
      getFailed: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationQueueService,
        {
          provide: getQueueToken(NOTIFICATION_QUEUE_NAME),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<NotificationQueueService>(NotificationQueueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add notification job to queue', async () => {
    const jobData = {
      notificationId: 1,
      userId: 1,
      title: '테스트 알림',
      body: '테스트 내용',
      meta: { contentType: ContentType.DIVIDEND },
    };

    await service.addNotificationJob(jobData);

    expect(mockQueue.add).toHaveBeenCalledWith(
      NotificationJobType.SEND_ALL_CHANNELS,
      jobData,
      { priority: 10 }, // DIVIDEND는 높은 우선순위
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

  it('should prioritize dividend notifications', async () => {
    const dividendJob = {
      notificationId: 1,
      userId: 1,
      title: '배당 알림',
      body: '배당 내용',
      meta: { contentType: ContentType.DIVIDEND },
    };

    const earningsJob = {
      notificationId: 2,
      userId: 1,
      title: '실적 알림',
      body: '실적 내용',
      meta: { contentType: ContentType.EARNINGS },
    };

    await service.addNotificationJob(dividendJob);
    await service.addNotificationJob(earningsJob);

    expect(mockQueue.add).toHaveBeenNthCalledWith(
      1,
      NotificationJobType.SEND_ALL_CHANNELS,
      dividendJob,
      { priority: 10 },
    );

    expect(mockQueue.add).toHaveBeenNthCalledWith(
      2,
      NotificationJobType.SEND_ALL_CHANNELS,
      earningsJob,
      { priority: 5 },
    );
  });
});
