import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { SlackService } from '../slack/slack.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import { ContentType } from '@prisma/client';

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
    subscriptionCompany: {
      findFirst: jest.fn(),
    },
    subscriptionIndicatorGroup: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockEmailService = {
    sendNotificationEmail: jest.fn(),
  };

  const mockSlackService = {
    sendSlackNotification: jest.fn(),
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
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: SlackService,
          useValue: mockSlackService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  describe('알림 생성', () => {
    it('알림을 정상적으로 생성한다', async () => {
      const dto = {
        contentType: ContentType.EARNINGS,
        contentId: 2,
        userId: 1,
      };
      const mockEarnings = {
        id: 2,
        releaseDate: BigInt(1625097600000),
        releaseTiming: 'PRE_MARKET',
        actualEPS: '2.5',
        forecastEPS: '2.3',
        previousEPS: '2.1',
        actualRevenue: '1000000',
        forecastRevenue: '950000',
        previousRevenue: '900000',
        companyId: 1,
        country: 'USA',
        createdAt: new Date(),
        updatedAt: new Date(),
        company: {
          id: 1,
          name: 'Test Company',
          ticker: 'TEST',
          country: 'USA',
          marketValue: '1000000000',
        },
      };
      const mockSubscription = {
        id: 1,
        userId: 1,
        companyId: 1,
        isActive: true,
        user: {
          id: 1,
          email: 'test@example.com',
          notificationSettings: {
            emailEnabled: true,
            slackEnabled: false,
            notificationsEnabled: true,
          },
        },
      };
      const mockNotification = {
        id: 1,
        userId: 1,
        contentType: ContentType.EARNINGS,
        contentId: 2,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockSettings = {
        id: 1,
        userId: 1,
        emailEnabled: false,
        slackEnabled: false,
        slackWebhookUrl: null,
        notificationsEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.earnings.findUnique.mockResolvedValue(mockEarnings);
      mockPrismaService.subscriptionCompany.findFirst.mockResolvedValue(
        mockSubscription,
      );
      mockPrismaService.notification.create.mockResolvedValue(mockNotification);

      // getUserNotificationSettings 메서드를 spy로 mock
      jest
        .spyOn(service, 'getUserNotificationSettings')
        .mockResolvedValue(mockSettings);

      const result = await service.createNotification(dto);

      expect(prismaService.earnings.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        include: { company: true },
      });
      expect(prismaService.subscriptionCompany.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 1,
          companyId: 1,
          isActive: true,
        },
        include: {
          user: {
            include: {
              notificationSettings: true,
            },
          },
        },
      });
      expect(service.getUserNotificationSettings).toHaveBeenCalledWith(1);
      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          contentType: ContentType.EARNINGS,
          contentId: 2,
          isRead: false,
        },
      });
    });
  });

  describe('알림 설정 조회', () => {
    it('설정이 있으면 해당 설정을 반환한다', async () => {
      const mockSettings = {
        id: 1,
        userId: 1,
        emailEnabled: true,
        slackEnabled: false,
        slackWebhookUrl: null,
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

    it('설정이 없으면 기본값을 생성하여 반환한다', async () => {
      mockPrismaService.userNotificationSettings.findUnique.mockResolvedValue(
        null,
      );
      const mockCreated = {
        id: 2,
        userId: 1,
        emailEnabled: false,
        slackEnabled: false,
        slackWebhookUrl: null,
      };
      mockPrismaService.userNotificationSettings.create.mockResolvedValue(
        mockCreated,
      );

      const result = await service.getUserNotificationSettings(1);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('알림 설정 업데이트', () => {
    it('알림 설정을 업데이트한다', async () => {
      const dto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        slackEnabled: true,
        slackWebhookUrl: 'https://slack.com/webhook',
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
        update: {
          emailEnabled: false,
          slackEnabled: true,
          slackWebhookUrl: 'https://slack.com/webhook',
        },
        create: {
          userId: 1,
          emailEnabled: false,
          slackEnabled: true,
          slackWebhookUrl: 'https://slack.com/webhook',
          notificationsEnabled: true,
        },
      });
      expect(result).toEqual(mockSettings);
    });
  });

  describe('알림 목록 조회', () => {
    it('알림 목록과 총 개수를 반환한다', async () => {
      const mockNotifications = [
        {
          id: 1,
          userId: 1,
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 1,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          userId: 1,
          contentType: ContentType.EARNINGS,
          contentId: 2,
          isRead: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockTotal = 2;
      const mockEarnings = [
        {
          id: 2,
          releaseDate: BigInt(1625097600000),
          releaseTiming: 'PRE_MARKET',
          actualEPS: '2.5',
          forecastEPS: '2.3',
          previousEPS: '2.1',
          actualRevenue: '1000000',
          forecastRevenue: '950000',
          previousRevenue: '900000',
          companyId: 1,
          country: 'USA',
          createdAt: new Date(),
          updatedAt: new Date(),
          company: {
            id: 1,
            name: 'Test Company',
            ticker: 'TEST',
            country: 'USA',
            marketValue: '1000000000',
          },
        },
      ];
      const mockIndicators = [
        {
          id: 1,
          name: 'Test Indicator',
          releaseDate: BigInt(1625097600000),
          baseName: 'Test Indicator',
          country: 'USA',
          importance: 3,
          actual: '5.4%',
          forecast: '5.0%',
          previous: '4.9%',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(
        mockNotifications,
      );
      mockPrismaService.notification.count.mockResolvedValue(mockTotal);
      mockPrismaService.earnings.findMany.mockResolvedValue(mockEarnings);
      mockPrismaService.economicIndicator.findMany.mockResolvedValue(
        mockIndicators,
      );

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
      expect(result.notifications).toHaveLength(2);
      expect(result.pagination.total).toEqual(mockTotal);
    });
  });

  describe('읽지 않은 알림 개수 조회', () => {
    it('읽지 않은 알림 개수를 반환한다', async () => {
      mockPrismaService.notification.count.mockResolvedValue(5);

      const result = await service.getUnreadNotificationsCount(1);

      expect(prismaService.notification.count).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('알림 읽음 처리', () => {
    it('알림이 존재하고 본인 소유일 때 읽음 처리한다', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        isRead: false,
      });
      mockPrismaService.notification.update.mockResolvedValue({
        id: 1,
        userId: 1,
        isRead: true,
      });

      const result = await service.markAsRead(1, 1);

      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.notification.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isRead: true },
      });
      expect(result.message).toContain('읽음으로 변경');
    });

    it('알림이 존재하지 않으면 NotFoundException 발생', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.markAsRead(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('알림이 본인 소유가 아니면 ForbiddenException 발생', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 2,
        isRead: false,
      });

      await expect(service.markAsRead(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('모든 알림 읽음 처리', () => {
    it('모든 알림을 읽음 처리한다', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(1);

      expect(prismaService.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
        data: { isRead: true },
      });
      expect(result.message).toContain('모든 알림을 읽음으로 표시했습니다.');
    });
  });

  describe('알림 삭제', () => {
    it('알림이 존재하고 본인 소유일 때 삭제한다', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
      });
      mockPrismaService.notification.delete.mockResolvedValue({
        id: 1,
        userId: 1,
      });

      const result = await service.deleteNotification(1, 1);

      expect(prismaService.notification.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.notification.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result.message).toContain('알림이 삭제');
    });

    it('알림이 존재하지 않으면 NotFoundException 발생', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      await expect(service.deleteNotification(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('알림이 본인 소유가 아니면 ForbiddenException 발생', async () => {
      mockPrismaService.notification.findUnique.mockResolvedValue({
        id: 1,
        userId: 2,
      });

      await expect(service.deleteNotification(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('모든 알림 삭제', () => {
    it('모든 알림을 삭제한다', async () => {
      mockPrismaService.notification.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.deleteAllUserNotifications(1);

      expect(prismaService.notification.deleteMany).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
      expect(result.message).toContain('모든 알림이 삭제');
      expect(result.count).toBe(3);
    });
  });
});
