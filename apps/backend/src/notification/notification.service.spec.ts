import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType, NotificationMethod } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateUserNotificationSettingsDto,
} from './dto/notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    userNotificationSettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    earningsNotification: {
      upsert: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    indicatorNotification: {
      upsert: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    dividendNotification: {
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    economicIndicator: {
      findMany: jest.fn(),
    },
    earnings: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findContentSubscriptions', () => {
    it('should find economic indicator subscriptions', async () => {
      const mockIndicatorSubs = [
        {
          userId: 1,
          indicatorId: 1,
          user: {
            id: 1,
            notificationSettings: {
              emailEnabled: true,
            },
          },
        },
      ];
      mockPrismaService.indicatorNotification.findMany.mockResolvedValue(
        mockIndicatorSubs,
      );

      const result = await service.findContentSubscriptions(
        ContentType.ECONOMIC_INDICATOR,
        1,
      );

      expect(prismaService.indicatorNotification.findMany).toHaveBeenCalledWith(
        {
          where: { indicatorId: 1 },
          include: { user: { include: { notificationSettings: true } } },
        },
      );
      expect(result).toEqual(mockIndicatorSubs);
    });

    it('should find earnings subscriptions', async () => {
      const mockEarningsSubs = [
        {
          userId: 1,
          earningsId: 1,
          user: {
            id: 1,
            notificationSettings: {
              emailEnabled: true,
            },
          },
        },
      ];
      mockPrismaService.earningsNotification.findMany.mockResolvedValue(
        mockEarningsSubs,
      );

      const result = await service.findContentSubscriptions(
        ContentType.EARNINGS,
        1,
      );

      expect(prismaService.earningsNotification.findMany).toHaveBeenCalledWith({
        where: { earningsId: 1 },
        include: { user: { include: { notificationSettings: true } } },
      });
      expect(result).toEqual(mockEarningsSubs);
    });

    it('should throw NotFoundException for unsupported content type', async () => {
      await expect(
        service.findContentSubscriptions('UNSUPPORTED' as ContentType, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const dto: CreateNotificationDto = {
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 1,
      };
      const mockNotification = {
        id: 1,
        ...dto,
        read: false,
        createdAt: new Date(),
      };
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification(dto);

      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getUserNotificationSettings', () => {
    it('should return user notification settings if they exist', async () => {
      const mockSettings = {
        id: 1,
        userId: 1,
        emailEnabled: true,
        pushEnabled: false,
        preferredMethod: 'EMAIL',
      };
      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        mockSettings,
      );

      const result = await service.getUserNotificationSettings(1);

      expect(
        prismaService.userNotificationSettings.findUnique,
      ).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result).toEqual(mockSettings);
    });

    it('should return default settings if user has no settings', async () => {
      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        null,
      );

      const result = await service.getUserNotificationSettings(1);

      expect(result).toEqual({
        emailEnabled: true,
        pushEnabled: true,
        preferredMethod: 'BOTH',
      });
    });
  });

  describe('updateUserNotificationSettings', () => {
    it('should update user notification settings', async () => {
      const dto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        pushEnabled: true,
        preferredMethod: 'PUSH',
      };
      const mockSettings = {
        id: 1,
        userId: 1,
        ...dto,
      };
      mockPrismaService.userNotificationSettings.upsert.mockResolvedValue(
        mockSettings,
      );

      const result = await service.updateUserNotificationSettings(1, dto);

      expect(
        prismaService.userNotificationSettings.upsert,
      ).toHaveBeenCalledWith({
        where: { userId: 1 },
        update: dto,
        create: { userId: 1, ...dto },
      });
      expect(result).toEqual(mockSettings);
    });
  });

  describe('subscribeContent', () => {
    it('should subscribe to economic indicator', async () => {
      const mockSub = { userId: 1, indicatorId: 1 };
      mockPrismaService.indicatorNotification.upsert.mockResolvedValue(mockSub);

      const result = await service.subscribeContent(
        1,
        ContentType.ECONOMIC_INDICATOR,
        1,
      );

      expect(prismaService.indicatorNotification.upsert).toHaveBeenCalledWith({
        where: { userId_indicatorId: { userId: 1, indicatorId: 1 } },
        update: {},
        create: { userId: 1, indicatorId: 1 },
      });
      expect(result).toEqual(mockSub);
    });

    it('should subscribe to earnings', async () => {
      const mockSub = { userId: 1, earningsId: 1 };
      mockPrismaService.earningsNotification.upsert.mockResolvedValue(mockSub);

      const result = await service.subscribeContent(1, ContentType.EARNINGS, 1);

      expect(prismaService.earningsNotification.upsert).toHaveBeenCalledWith({
        where: { userId_earningsId: { userId: 1, earningsId: 1 } },
        update: {},
        create: { userId: 1, earningsId: 1 },
      });
      expect(result).toEqual(mockSub);
    });

    it('should throw NotFoundException for unsupported content type', async () => {
      await expect(
        service.subscribeContent(1, 'UNSUPPORTED' as ContentType, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('unsubscribeContent', () => {
    it('should unsubscribe from economic indicator', async () => {
      const mockSub = { userId: 1, indicatorId: 1 };
      mockPrismaService.indicatorNotification.delete.mockResolvedValue(mockSub);

      const result = await service.unsubscribeContent(
        1,
        ContentType.ECONOMIC_INDICATOR,
        1,
      );

      expect(prismaService.indicatorNotification.delete).toHaveBeenCalledWith({
        where: { userId_indicatorId: { userId: 1, indicatorId: 1 } },
      });
      expect(result).toEqual(mockSub);
    });

    it('should unsubscribe from earnings', async () => {
      const mockSub = { userId: 1, earningsId: 1 };
      mockPrismaService.earningsNotification.delete.mockResolvedValue(mockSub);

      const result = await service.unsubscribeContent(
        1,
        ContentType.EARNINGS,
        1,
      );

      expect(prismaService.earningsNotification.delete).toHaveBeenCalledWith({
        where: { userId_earningsId: { userId: 1, earningsId: 1 } },
      });
      expect(result).toEqual(mockSub);
    });

    it('should throw NotFoundException for unsupported content type', async () => {
      await expect(
        service.unsubscribeContent(1, 'UNSUPPORTED' as ContentType, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications with details', async () => {
      const mockNotifications = [
        {
          id: 1,
          userId: 1,
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 1,
          read: false,
        },
        {
          id: 2,
          userId: 1,
          contentType: ContentType.EARNINGS,
          contentId: 2,
          read: true,
        },
      ];
      const mockTotal = 2;
      const mockIndicators = [
        {
          id: 1,
          name: 'GDP',
          actual: '2.5%',
          forecast: '2.2%',
          releaseDate: 1620000000,
        },
      ];
      const mockEarnings = [
        {
          id: 2,
          actualEPS: 2.5,
          forecastEPS: 2.2,
          actualRevenue: 100000,
          forecastRevenue: 95000,
          releaseDate: 1620000000,
          company: { name: 'Apple' },
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      mockPrismaService.notification.count.mockResolvedValue(mockTotal);
      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockIndicators,
      );
      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarnings);

      const result = await service.getUserNotifications(1, 1, 100);

      expect(prismaService.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 100,
      });
      expect(prismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(prismaService.economicIndicator.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1] } },
      });
      expect(prismaService.earnings.findMany).toHaveBeenCalledWith({
        where: { id: { in: [2] } },
        include: { company: true },
      });

      expect(result.total).toEqual(mockTotal);
      expect(result.notifications).toHaveLength(2);
      expect(result.notifications[0]).toHaveProperty('eventName', 'GDP');
      expect(result.notifications[1]).toHaveProperty('eventName', 'Apple');
    });
  });

  describe('getUnreadNotificationsCount', () => {
    it('should get unread notifications count', async () => {
      mockPrismaService.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadNotificationsCount(1);

      expect(prismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 1, read: false },
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read when it exists and belongs to user', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        read: false,
      });
      mockPrismaService.notification.update.mockResolvedValue({
        id: 1,
        userId: 1,
        read: true,
      });

      const result = await service.markAsRead(1, 1);

      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { read: true },
      });
      expect(result.message).toContain('읽음으로 변경');
    });

    it('should throw NotFoundException when notification does not exist', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when notification belongs to another user', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 2, // Different user
        read: false,
      });

      await expect(service.markAsRead(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all user notifications as read', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(1);

      expect(prismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 1, read: false },
        data: { read: true },
      });
      expect(result.message).toContain('모든 알림을 읽음으로 표시했습니다.');
    });
  });

  describe('deleteUserNotification', () => {
    it('should delete notification when it exists and belongs to user', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
      });
      mockPrismaService.notification.delete.mockResolvedValue({
        id: 1,
        userId: 1,
      });

      const result = await service.deleteUserNotification(1, 1);

      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.message).toContain('알림이 삭제');
    });

    it('should throw NotFoundException when notification does not exist', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.deleteUserNotification(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when notification belongs to another user', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 2, // Different user
      });

      await expect(service.deleteUserNotification(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addEarningsNotification', () => {
    it('should add earnings notification subscription', async () => {
      const mockSub = { userId: 1, earningsId: 1 };
      service.subscribeContent = jest.fn().mockResolvedValue(mockSub);

      const result = await service.addEarningsNotification(1, 1);

      expect(service.subscribeContent).toHaveBeenCalledWith(
        1,
        ContentType.EARNINGS,
        1,
      );
      expect(result).toEqual(mockSub);
    });
  });

  describe('removeEarningsNotification', () => {
    it('should remove earnings notification subscription', async () => {
      const mockSub = { userId: 1, earningsId: 1 };
      service.unsubscribeContent = jest.fn().mockResolvedValue(mockSub);

      const result = await service.removeEarningsNotification(1, 1);

      expect(service.unsubscribeContent).toHaveBeenCalledWith(
        1,
        ContentType.EARNINGS,
        1,
      );
      expect(result).toEqual(mockSub);
    });
  });

  describe('addEconomicIndicatorNotification', () => {
    it('should add economic indicator notification subscription', async () => {
      const mockSub = { userId: 1, indicatorId: 1 };
      service.subscribeContent = jest.fn().mockResolvedValue(mockSub);

      const result = await service.addEconomicIndicatorNotification(1, 1);

      expect(service.subscribeContent).toHaveBeenCalledWith(
        1,
        ContentType.ECONOMIC_INDICATOR,
        1,
      );
      expect(result).toEqual(mockSub);
    });
  });

  describe('removeEconomicIndicatorNotification', () => {
    it('should remove economic indicator notification subscription', async () => {
      const mockSub = { userId: 1, indicatorId: 1 };
      service.unsubscribeContent = jest.fn().mockResolvedValue(mockSub);

      const result = await service.removeEconomicIndicatorNotification(1, 1);

      expect(service.unsubscribeContent).toHaveBeenCalledWith(
        1,
        ContentType.ECONOMIC_INDICATOR,
        1,
      );
      expect(result).toEqual(mockSub);
    });
  });
});
