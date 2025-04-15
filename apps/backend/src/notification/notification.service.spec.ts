import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContentType, NotificationMethod } from '@prisma/client';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
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
    indicatorNotification: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    earningsNotification: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    economicIndicator: {
      findUnique: jest.fn(),
    },
    earnings: {
      findUnique: jest.fn(),
    },
    dividend: {
      findUnique: jest.fn(),
    },
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

    // 모든 모킹 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: {
          contentType: dto.contentType,
          contentId: dto.contentId,
          userId: dto.userId,
        },
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications with pagination', async () => {
      const userId = 1;
      const page = 2;
      const limit = 5;
      const skip = (page - 1) * limit;

      const mockNotifications = [
        { id: 1, contentType: ContentType.EARNINGS, contentId: 1, userId: 1 },
        {
          id: 2,
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 2,
          userId: 1,
        },
      ];
      const mockTotal = 10;

      mockPrismaService.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      mockPrismaService.notification.count.mockResolvedValue(mockTotal);

      const result = await service.getUserNotifications(userId, page, limit);

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });
      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual({
        notifications: mockNotifications,
        total: mockTotal,
      });
    });
  });

  describe('getUnreadNotificationsCount', () => {
    it('should return unread notifications count', async () => {
      const userId = 1;
      const mockCount = 5;

      mockPrismaService.notification.count.mockResolvedValue(mockCount);

      const result = await service.getUnreadNotificationsCount(userId);

      expect(mockPrismaService.notification.count).toHaveBeenCalledWith({
        where: {
          userId,
          read: false,
        },
      });
      expect(result).toEqual({ count: mockCount });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const userId = 1;
      const notificationId = 2;

      const mockNotification = {
        id: notificationId,
        userId,
        contentType: ContentType.EARNINGS,
        contentId: 1,
        read: false,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        mockNotification,
      );
      mockPrismaService.notification.update.mockResolvedValue({
        ...mockNotification,
        read: true,
      });

      const result = await service.markAsRead(userId, notificationId);

      expect(mockPrismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: notificationId },
      });
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        where: { id: notificationId },
        data: { read: true },
      });
      expect(result).toEqual({ message: '알림이 읽음으로 표시되었습니다.' });
    });

    it('should throw NotFoundException if notification does not exist', async () => {
      const userId = 1;
      const notificationId = 999;

      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(userId, notificationId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if notification belongs to another user', async () => {
      const userId = 1;
      const notificationId = 2;
      const anotherUserId = 3;

      const mockNotification = {
        id: notificationId,
        userId: anotherUserId,
        contentType: ContentType.EARNINGS,
        contentId: 1,
        read: false,
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        mockNotification,
      );

      await expect(service.markAsRead(userId, notificationId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getUserNotificationSettings', () => {
    it('should get user notification settings', async () => {
      const userId = 1;
      const mockSettings = {
        userId: 1,
        emailEnabled: true,
        pushEnabled: false,
        preferredMethod: 'EMAIL',
      };

      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        mockSettings,
      );

      const result = await service.getUserNotificationSettings(userId);

      expect(
        mockPrismaService.userNotificationSettings.findUnique,
      ).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(mockSettings);
    });

    it('should return default settings if user has no settings', async () => {
      const userId = 1;

      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        null,
      );

      const result = await service.getUserNotificationSettings(userId);

      expect(result).toEqual({
        emailEnabled: true,
        pushEnabled: true,
        preferredMethod: 'BOTH',
      });
    });
  });

  describe('updateUserNotificationSettings', () => {
    it('should update user notification settings', async () => {
      const userId = 1;
      const updateDto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        pushEnabled: true,
        preferredMethod: 'PUSH',
      };

      const mockSettings = {
        userId,
        ...updateDto,
      };

      mockPrismaService.userNotificationSettings.upsert.mockResolvedValue(
        mockSettings,
      );

      const result = await service.updateUserNotificationSettings(
        userId,
        updateDto,
      );

      expect(
        mockPrismaService.userNotificationSettings.upsert,
      ).toHaveBeenCalledWith({
        where: { userId },
        update: updateDto,
        create: {
          userId,
          emailEnabled: updateDto.emailEnabled,
          pushEnabled: updateDto.pushEnabled,
          preferredMethod: updateDto.preferredMethod,
        },
      });
      expect(result).toEqual(mockSettings);
    });
  });
});
