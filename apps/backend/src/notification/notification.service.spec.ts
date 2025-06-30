import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationQueueService } from './queue/notification-queue.service';
import { NotificationSSEService } from './sse/notification-sse.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import { ContentType, NotificationType } from '@prisma/client';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;
  let queueService: NotificationQueueService;
  let sseService: NotificationSSEService;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    userNotificationSettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
    },
    economicIndicator: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    earnings: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    dividend: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    subscriptionCompany: {
      findFirst: jest.fn(),
    },
    subscriptionIndicatorGroup: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockQueueService = {
    addNotificationJob: jest.fn(),
    getQueueStatus: jest.fn(),
    retryFailedJobs: jest.fn(),
  };

  const mockSSEService = {
    publishNewNotification: jest.fn(),
    publishUnreadCountUpdate: jest.fn(),
    getNotificationStream: jest.fn(),
    isConnected: jest.fn().mockReturnValue(true),
    testConnection: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationQueueService,
          useValue: mockQueueService,
        },
        {
          provide: NotificationSSEService,
          useValue: mockSSEService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
    queueService = module.get<NotificationQueueService>(
      NotificationQueueService,
    );
    sseService = module.get<NotificationSSEService>(NotificationSSEService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('createNotification', () => {
    const mockDto = {
      contentType: ContentType.EARNINGS,
      contentId: 1,
      userId: 1,
      notificationType: NotificationType.DATA_CHANGED,
      previousData: { actualEPS: '2.0' },
      currentData: { actualEPS: '2.5' },
    };

    const mockEarnings = {
      id: 1,
      companyId: 1,
      company: { id: 1, name: 'Test Company' },
    };

    const mockSubscription = {
      id: 1,
      userId: 1,
      companyId: 1,
      isActive: true,
      user: { id: 1, email: 'test@example.com' },
    };

    const mockNotification = {
      id: 1,
      userId: 1,
      contentType: ContentType.EARNINGS,
      contentId: 1,
      notificationType: NotificationType.DATA_CHANGED,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockUserSettings = {
      id: 1,
      userId: 1,
      emailEnabled: true,
      slackEnabled: false,
      slackWebhookUrl: null,
      notificationsEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('정상적으로 알림을 생성하고 큐와 SSE에 발행해야 한다', async () => {
      // Mock 설정
      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.subscriptionCompany.findFirst.mockResolvedValue(
        mockSubscription,
      );
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);
      mockPrismaService.notification.count.mockResolvedValue(5); // 읽지 않은 알림 개수

      jest
        .spyOn(service, 'getUserNotificationSettings')
        .mockResolvedValue(mockUserSettings);

      // 실행
      const result = await service.createNotification(mockDto);

      // 검증
      expect(result).toEqual(mockNotification);

      // 1. 구독 정보 조회 확인
      expect(mockPrismaService.earnings.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { company: true },
      });

      expect(
        mockPrismaService.subscriptionCompany.findFirst,
      ).toHaveBeenCalledWith({
        where: { userId: 1, companyId: 1, isActive: true },
        include: { user: true },
      });

      // 2. 알림 생성 확인
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          contentType: ContentType.EARNINGS,
          contentId: 1,
          notificationType: NotificationType.DATA_CHANGED,
          isRead: false,
        },
      });

      // 3. 큐 작업 추가 확인
      expect(mockQueueService.addNotificationJob).toHaveBeenCalledWith({
        notificationId: 1,
        userId: 1,
        userEmail: 'test@example.com',
        contentType: ContentType.EARNINGS,
        contentId: 1,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: { actualEPS: '2.0' },
        currentData: { actualEPS: '2.5' },
        userSettings: mockUserSettings,
      });

      // 4. SSE 이벤트 발행 확인
      expect(mockSSEService.publishNewNotification).toHaveBeenCalledWith({
        id: 1,
        userId: 1,
        contentType: ContentType.EARNINGS,
        contentId: 1,
        isRead: false,
        createdAt: mockNotification.createdAt,
        unreadCount: 5,
      });
    });

    it('구독 정보가 없으면 NotFoundException을 던진다', async () => {
      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.subscriptionCompany.findFirst.mockResolvedValue(null);

      await expect(service.createNotification(mockDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('경제지표 알림 생성 시 올바른 구독 정보를 조회한다', async () => {
      const indicatorDto = {
        ...mockDto,
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: 2,
      };

      const mockIndicator = {
        id: 2,
        baseName: 'CPI',
        country: 'USA',
      };

      const mockIndicatorSubscription = {
        id: 2,
        userId: 1,
        baseName: 'CPI',
        country: 'USA',
        isActive: true,
        user: { id: 1, email: 'test@example.com' },
      };

      mockPrismaService.economicIndicator.findUnique.mockResolvedValue(
        mockIndicator,
      );
      mockPrismaService.subscriptionIndicatorGroup.findFirst.mockResolvedValue(
        mockIndicatorSubscription,
      );
      mockPrismaService.notification.create.mockResolvedValue({
        ...mockNotification,
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: 2,
      });
      mockPrismaService.notification.count.mockResolvedValue(3);

      jest
        .spyOn(service, 'getUserNotificationSettings')
        .mockResolvedValue(mockUserSettings);

      await service.createNotification(indicatorDto);

      expect(
        mockPrismaService.economicIndicator.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 2 },
      });

      expect(
        mockPrismaService.subscriptionIndicatorGroup.findFirst,
      ).toHaveBeenCalledWith({
        where: {
          userId: 1,
          baseName: 'CPI',
          country: 'USA',
          isActive: true,
        },
        include: { user: true },
      });
    });

    it('배당 알림 생성 시 올바른 구독 정보를 조회한다', async () => {
      const dividendDto = {
        ...mockDto,
        contentType: ContentType.DIVIDEND,
        contentId: 3,
      };

      const mockDividend = {
        id: 3,
        companyId: 1,
        company: { id: 1, name: 'Test Company' },
      };

      mockPrismaService.dividend.findUnique.mockResolvedValue(mockDividend);
      mockPrismaService.subscriptionCompany.findFirst.mockResolvedValue(
        mockSubscription,
      );
      mockPrismaService.notification.create.mockResolvedValue({
        ...mockNotification,
        contentType: ContentType.DIVIDEND,
        contentId: 3,
      });
      mockPrismaService.notification.count.mockResolvedValue(2);

      jest
        .spyOn(service, 'getUserNotificationSettings')
        .mockResolvedValue(mockUserSettings);

      await service.createNotification(dividendDto);

      expect(mockPrismaService.dividend.findUnique).toHaveBeenCalledWith({
        where: { id: 3 },
        include: { company: true },
      });
    });
  });

  describe('getUserNotificationSettings', () => {
    it('기존 설정이 있으면 반환한다', async () => {
      const mockSettings = {
        id: 1,
        userId: 1,
        emailEnabled: true,
        slackEnabled: false,
        slackWebhookUrl: null,
        notificationsEnabled: true,
      };

      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        mockSettings,
      );

      const result = await service.getUserNotificationSettings(1);

      expect(result).toEqual(mockSettings);
      expect(
        mockPrismaService.userNotificationSettings.findUnique,
      ).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it('기존 설정이 없으면 기본 설정을 생성한다', async () => {
      const mockCreatedSettings = {
        id: 2,
        userId: 1,
        emailEnabled: false,
        slackEnabled: false,
        slackWebhookUrl: null,
        notificationsEnabled: true,
      };

      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        null,
      );
      mockPrismaService.userNotificationSettings.create.mockResolvedValue(
        mockCreatedSettings,
      );

      const result = await service.getUserNotificationSettings(1);

      expect(result).toEqual(mockCreatedSettings);
      expect(
        mockPrismaService.userNotificationSettings.create,
      ).toHaveBeenCalledWith({
        data: {
          userId: 1,
          emailEnabled: false,
          slackEnabled: false,
          slackWebhookUrl: null,
          notificationsEnabled: true,
        },
      });
    });
  });

  describe('markAsRead', () => {
    it('알림을 읽음으로 표시하고 SSE 이벤트를 발행한다', async () => {
      const mockNotification = {
        id: 1,
        userId: 1,
        isRead: false,
      };

      const mockUpdatedNotification = {
        ...mockNotification,
        isRead: true,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        mockNotification,
      );
      mockPrismaService.notification.update.mockResolvedValue(
        mockUpdatedNotification,
      );
      mockPrismaService.notification.count.mockResolvedValue(4); // 읽지 않은 알림 개수

      const result = await service.markAsRead(1, 1);

      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRead: true },
      });

      expect(mockSSEService.publishUnreadCountUpdate).toHaveBeenCalledWith(
        1,
        4,
      );
      expect(result.message).toContain('읽음으로 변경');
    });

    it('존재하지 않는 알림에 대해 NotFoundException을 던진다', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('다른 사용자의 알림에 대해 ForbiddenException을 던진다', async () => {
      const mockNotification = {
        id: 1,
        userId: 2, // 다른 사용자
        isRead: false,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        mockNotification,
      );

      await expect(service.markAsRead(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('markAllAsRead', () => {
    it('모든 알림을 읽음으로 표시하고 SSE 이벤트를 발행한다', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead(1);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
        data: { isRead: true },
      });

      expect(mockSSEService.publishUnreadCountUpdate).toHaveBeenCalledWith(
        1,
        0,
      );
      expect(result.message).toContain('모든 알림을 읽음으로 표시');
    });
  });

  describe('getUnreadNotificationsCount', () => {
    it('읽지 않은 알림 개수를 반환한다', async () => {
      mockPrismaService.notification.count.mockResolvedValue(7);

      const result = await service.getUnreadNotificationsCount(1);

      expect(result).toEqual({ count: 7 });
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
      });
    });
  });

  describe('updateUserNotificationSettings', () => {
    it('알림 설정을 업데이트한다', async () => {
      const dto: UpdateUserNotificationSettingsDto = {
        emailEnabled: true,
        slackEnabled: true,
        slackWebhookUrl: 'https://hooks.slack.com/test',
        notificationsEnabled: true,
      };

      const mockUpdatedSettings = {
        id: 1,
        userId: 1,
        ...dto,
      };

      mockPrismaService.userNotificationSettings.upsert.mockResolvedValue(
        mockUpdatedSettings,
      );

      const result = await service.updateUserNotificationSettings(1, dto);

      expect(result).toEqual(mockUpdatedSettings);
      expect(
        mockPrismaService.userNotificationSettings.upsert,
      ).toHaveBeenCalledWith({
        where: { userId: 1 },
        update: {
          emailEnabled: true,
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/test',
          notificationsEnabled: true,
        },
        create: {
          userId: 1,
          emailEnabled: true,
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/test',
          notificationsEnabled: true,
        },
      });
    });
  });

  describe('deleteNotification', () => {
    it('알림을 삭제한다', async () => {
      const mockNotification = {
        id: 1,
        userId: 1,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        mockNotification,
      );
      mockPrismaService.notification.delete.mockResolvedValue(mockNotification);

      const result = await service.deleteNotification(1, 1);

      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.message).toContain('알림이 삭제');
    });
  });

  describe('deleteAllUserNotifications', () => {
    it('모든 사용자 알림을 삭제한다', async () => {
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 5 });

      const result = await service.deleteAllUserNotifications(1);

      expect(mockPrismaService.notification.deleteMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result.count).toBe(5);
      expect(result.message).toContain('모든 알림이 삭제');
    });
  });
});
