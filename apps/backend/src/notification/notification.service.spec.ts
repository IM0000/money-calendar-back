import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { NotificationQueueService } from './queue/notification-queue.service';
import { NotificationSSEService } from './sse/notification-sse.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';
import { ContentType, NotificationType } from '@prisma/client';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: NotificationRepository;
  let queueService: NotificationQueueService;
  let sseService: NotificationSSEService;

  // 테스트 데이터 팩토리 함수들
  const createMockEarnings = (overrides = {}) => ({
    id: 1,
    companyId: 1,
    company: { id: 1, name: 'Test Company' },
    ...overrides,
  });

  const createMockSubscription = (overrides = {}) => ({
    id: 1,
    userId: 1,
    companyId: 1,
    isActive: true,
    user: { id: 1, email: 'test@example.com' },
    ...overrides,
  });

  const createMockNotification = (overrides = {}) => ({
    id: 1,
    userId: 1,
    contentType: ContentType.EARNINGS,
    contentId: 1,
    notificationType: NotificationType.DATA_CHANGED,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createMockUserSettings = (overrides = {}) => ({
    id: 1,
    userId: 1,
    emailEnabled: true,
    slackEnabled: false,
    slackWebhookUrl: null,
    discordEnabled: false,
    discordWebhookUrl: null,
    notificationsEnabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  const createNotificationDto = (overrides = {}) => ({
    contentType: ContentType.EARNINGS,
    contentId: 1,
    userId: 1,
    notificationType: NotificationType.DATA_CHANGED,
    previousData: { actualEPS: '2.0' },
    currentData: { actualEPS: '2.5' },
    ...overrides,
  });

  const mockNotificationRepository = {
    createNotification: jest.fn(),
    findNotificationById: jest.fn(),
    findUserNotifications: jest.fn(),
    countUserNotifications: jest.fn(),
    countUnreadNotifications: jest.fn(),
    markNotificationAsRead: jest.fn(),
    markAllUserNotificationsAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    deleteAllUserNotifications: jest.fn(),
    findEarningsById: jest.fn(),
    findDividendById: jest.fn(),
    findEconomicIndicatorById: jest.fn(),
    findCompanySubscription: jest.fn(),
    findIndicatorGroupSubscription: jest.fn(),
    findUserNotificationSettings: jest.fn(),
    createUserNotificationSettings: jest.fn(),
    upsertUserNotificationSettings: jest.fn(),
    findEarningsByIds: jest.fn(),
    findDividendsByIds: jest.fn(),
    findEconomicIndicatorsByIds: jest.fn(),
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
          provide: NotificationRepository,
          useValue: mockNotificationRepository,
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
    notificationRepository = module.get<NotificationRepository>(
      NotificationRepository,
    );
    queueService = module.get<NotificationQueueService>(
      NotificationQueueService,
    );
    sseService = module.get<NotificationSSEService>(NotificationSSEService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('NotificationService', () => {
    it('서비스 인스턴스가 정상적으로 생성되어야 한다', () => {
      expect(service).toBeDefined();
    });
  });

  describe('createNotification', () => {
    describe('실적 데이터 변경 알림 생성', () => {
      it('구독중인 회사의 실적이 변경되면 알림을 생성하고 큐에 작업을 추가한다', async () => {
        // Arrange
        const dto = createNotificationDto();
        const mockEarnings = createMockEarnings();
        const mockSubscription = createMockSubscription();
        const mockNotification = createMockNotification();
        const mockUserSettings = createMockUserSettings();
        const unreadCount = 5;

        mockNotificationRepository.findEarningsById.mockResolvedValue(
          mockEarnings,
        );
        mockNotificationRepository.findCompanySubscription.mockResolvedValue(
          mockSubscription,
        );
        mockNotificationRepository.createNotification.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
          unreadCount,
        );
        jest
          .spyOn(service, 'getUserNotificationSettings')
          .mockResolvedValue(mockUserSettings);

        // Act
        const result = await service.createNotification(dto);

        // Assert
        expect(result).toEqual(mockNotification);
        expect(mockQueueService.addNotificationJob).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationId: mockNotification.id,
            userId: dto.userId,
            userEmail: mockSubscription.user.email,
            contentType: dto.contentType,
            contentId: dto.contentId,
            notificationType: dto.notificationType,
            previousData: dto.previousData,
            currentData: dto.currentData,
            userSettings: mockUserSettings,
          }),
        );
      });

      it('구독중인 회사의 실적이 변경되면 SSE로 실시간 알림을 발행한다', async () => {
        // Arrange
        const dto = createNotificationDto();
        const mockNotification = createMockNotification();
        const unreadCount = 5;

        mockNotificationRepository.findEarningsById.mockResolvedValue(
          createMockEarnings(),
        );
        mockNotificationRepository.findCompanySubscription.mockResolvedValue(
          createMockSubscription(),
        );
        mockNotificationRepository.createNotification.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
          unreadCount,
        );
        jest
          .spyOn(service, 'getUserNotificationSettings')
          .mockResolvedValue(createMockUserSettings());

        // Act
        await service.createNotification(dto);

        // Assert
        expect(mockSSEService.publishNewNotification).toHaveBeenCalledWith({
          id: mockNotification.id,
          userId: mockNotification.userId,
          contentType: mockNotification.contentType,
          contentId: mockNotification.contentId,
          isRead: mockNotification.isRead,
          createdAt: mockNotification.createdAt,
          unreadCount: unreadCount,
        });
      });

      it('구독하지 않은 회사의 실적 변경시 NotFoundException을 발생시킨다', async () => {
        // Arrange
        const dto = createNotificationDto();
        mockNotificationRepository.findEarningsById.mockResolvedValue(
          createMockEarnings(),
        );
        mockNotificationRepository.findCompanySubscription.mockResolvedValue(
          null,
        );

        // Act & Assert
        await expect(service.createNotification(dto)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('경제지표 데이터 변경 알림 생성', () => {
      it('구독중인 경제지표가 변경되면 알림을 생성한다', async () => {
        // Arrange
        const dto = createNotificationDto({
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 2,
        });
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
        const mockNotification = createMockNotification({
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 2,
        });

        mockNotificationRepository.findEconomicIndicatorById.mockResolvedValue(
          mockIndicator,
        );
        mockNotificationRepository.findIndicatorGroupSubscription.mockResolvedValue(
          mockIndicatorSubscription,
        );
        mockNotificationRepository.createNotification.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
          3,
        );
        jest
          .spyOn(service, 'getUserNotificationSettings')
          .mockResolvedValue(createMockUserSettings());

        // Act
        const result = await service.createNotification(dto);

        // Assert
        expect(result).toEqual(mockNotification);
        expect(
          mockNotificationRepository.findIndicatorGroupSubscription,
        ).toHaveBeenCalledWith(
          dto.userId,
          mockIndicator.baseName,
          mockIndicator.country,
        );
      });
    });

    describe('배당 데이터 변경 알림 생성', () => {
      it('구독중인 회사의 배당이 변경되면 알림을 생성한다', async () => {
        // Arrange
        const dto = createNotificationDto({
          contentType: ContentType.DIVIDEND,
          contentId: 3,
        });
        const mockDividend = {
          id: 3,
          companyId: 1,
          company: { id: 1, name: 'Test Company' },
        };
        const mockNotification = createMockNotification({
          contentType: ContentType.DIVIDEND,
          contentId: 3,
        });

        mockNotificationRepository.findDividendById.mockResolvedValue(
          mockDividend,
        );
        mockNotificationRepository.findCompanySubscription.mockResolvedValue(
          createMockSubscription(),
        );
        mockNotificationRepository.createNotification.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
          2,
        );
        jest
          .spyOn(service, 'getUserNotificationSettings')
          .mockResolvedValue(createMockUserSettings());

        // Act
        const result = await service.createNotification(dto);

        // Assert
        expect(result).toEqual(mockNotification);
        expect(
          mockNotificationRepository.findDividendById,
        ).toHaveBeenCalledWith(dto.contentId);
      });
    });
  });

  describe('getUserNotificationSettings', () => {
    describe('기존 알림 설정 조회', () => {
      it('사용자의 기존 알림 설정이 존재하면 해당 설정을 반환한다', async () => {
        // Arrange
        const userId = 1;
        const mockSettings = createMockUserSettings();
        mockNotificationRepository.findUserNotificationSettings.mockResolvedValue(
          mockSettings,
        );

        // Act
        const result = await service.getUserNotificationSettings(userId);

        // Assert
        expect(result).toEqual(mockSettings);
        expect(
          mockNotificationRepository.findUserNotificationSettings,
        ).toHaveBeenCalledWith(userId);
      });
    });

    describe('기본 알림 설정 생성', () => {
      it('사용자의 알림 설정이 없으면 기본값으로 새로 생성한다', async () => {
        // Arrange
        const userId = 1;
        const mockCreatedSettings = createMockUserSettings({
          emailEnabled: false,
          slackEnabled: false,
        });

        mockNotificationRepository.findUserNotificationSettings.mockResolvedValue(
          null,
        );
        mockNotificationRepository.createUserNotificationSettings.mockResolvedValue(
          mockCreatedSettings,
        );

        // Act
        const result = await service.getUserNotificationSettings(userId);

        // Assert
        expect(result).toEqual(mockCreatedSettings);
        expect(
          mockNotificationRepository.createUserNotificationSettings,
        ).toHaveBeenCalledWith({
          userId,
          emailEnabled: false,
          slackEnabled: false,
          slackWebhookUrl: null,
          discordEnabled: false,
          discordWebhookUrl: null,
          notificationsEnabled: true,
        });
      });
    });
  });

  describe('markAsRead', () => {
    describe('알림 읽음 처리', () => {
      it('읽지 않은 알림을 읽음으로 표시하고 읽지 않은 알림 개수를 SSE로 전송한다', async () => {
        // Arrange
        const userId = 1;
        const notificationId = 1;
        const mockNotification = createMockNotification({ isRead: false });
        const mockUpdatedNotification = { ...mockNotification, isRead: true };
        const unreadCount = 4;

        mockNotificationRepository.findNotificationById.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.markNotificationAsRead.mockResolvedValue(
          mockUpdatedNotification,
        );
        mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
          unreadCount,
        );

        // Act
        const result = await service.markAsRead(userId, notificationId);

        // Assert
        expect(result.message).toContain('읽음으로 변경');
        expect(mockSSEService.publishUnreadCountUpdate).toHaveBeenCalledWith(
          userId,
          unreadCount,
        );
      });

      it('이미 읽은 알림을 다시 읽음 처리해도 정상적으로 동작한다', async () => {
        // Arrange
        const userId = 1;
        const notificationId = 1;
        const mockNotification = createMockNotification({ isRead: true });
        const unreadCount = 5;

        mockNotificationRepository.findNotificationById.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.markNotificationAsRead.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
          unreadCount,
        );

        // Act
        const result = await service.markAsRead(userId, notificationId);

        // Assert
        expect(result.message).toContain('읽음으로 변경');
      });
    });

    describe('알림 읽음 처리 권한 검증', () => {
      it('존재하지 않는 알림 ID로 요청시 NotFoundException을 발생시킨다', async () => {
        // Arrange
        const userId = 1;
        const notificationId = 999;
        mockNotificationRepository.findNotificationById.mockResolvedValue(null);

        // Act & Assert
        await expect(
          service.markAsRead(userId, notificationId),
        ).rejects.toThrow(NotFoundException);
      });

      it('다른 사용자의 알림을 읽음 처리하려고 하면 ForbiddenException을 발생시킨다', async () => {
        // Arrange
        const userId = 1;
        const notificationId = 1;
        const mockNotification = createMockNotification({ userId: 2 });

        mockNotificationRepository.findNotificationById.mockResolvedValue(
          mockNotification,
        );

        // Act & Assert
        await expect(
          service.markAsRead(userId, notificationId),
        ).rejects.toThrow(ForbiddenException);
      });
    });
  });

  describe('markAllAsRead', () => {
    it('사용자의 모든 읽지 않은 알림을 읽음으로 표시하고 개수 0을 SSE로 전송한다', async () => {
      // Arrange
      const userId = 1;
      const updateCount = 3;
      mockNotificationRepository.markAllUserNotificationsAsRead.mockResolvedValue(
        {
          count: updateCount,
        },
      );

      // Act
      const result = await service.markAllAsRead(userId);

      // Assert
      expect(result.message).toContain('모든 알림을 읽음으로 표시');
      expect(
        mockNotificationRepository.markAllUserNotificationsAsRead,
      ).toHaveBeenCalledWith(userId);
      expect(mockSSEService.publishUnreadCountUpdate).toHaveBeenCalledWith(
        userId,
        0,
      );
    });

    it('읽지 않은 알림이 없어도 정상적으로 동작한다', async () => {
      // Arrange
      const userId = 1;
      mockNotificationRepository.markAllUserNotificationsAsRead.mockResolvedValue(
        { count: 0 },
      );

      // Act
      const result = await service.markAllAsRead(userId);

      // Assert
      expect(result.message).toContain('모든 알림을 읽음으로 표시');
    });
  });

  describe('getUnreadNotificationsCount', () => {
    it('사용자의 읽지 않은 알림 개수를 정확히 반환한다', async () => {
      // Arrange
      const userId = 1;
      const unreadCount = 7;
      mockNotificationRepository.countUnreadNotifications.mockResolvedValue(
        unreadCount,
      );

      // Act
      const result = await service.getUnreadNotificationsCount(userId);

      // Assert
      expect(result).toEqual({ count: unreadCount });
      expect(
        mockNotificationRepository.countUnreadNotifications,
      ).toHaveBeenCalledWith(userId);
    });

    it('읽지 않은 알림이 없으면 0을 반환한다', async () => {
      // Arrange
      const userId = 1;
      mockNotificationRepository.countUnreadNotifications.mockResolvedValue(0);

      // Act
      const result = await service.getUnreadNotificationsCount(userId);

      // Assert
      expect(result).toEqual({ count: 0 });
    });
  });

  describe('updateUserNotificationSettings', () => {
    describe('알림 설정 업데이트', () => {
      it('이메일과 슬랙 알림을 모두 활성화한다', async () => {
        // Arrange
        const userId = 1;
        const dto: UpdateUserNotificationSettingsDto = {
          emailEnabled: true,
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/test',
          notificationsEnabled: true,
        };
        const mockUpdatedSettings = createMockUserSettings(dto);

        mockNotificationRepository.upsertUserNotificationSettings.mockResolvedValue(
          mockUpdatedSettings,
        );

        // Act
        const result = await service.updateUserNotificationSettings(
          userId,
          dto,
        );

        // Assert
        expect(result).toEqual(mockUpdatedSettings);
        expect(
          mockNotificationRepository.upsertUserNotificationSettings,
        ).toHaveBeenCalledWith(
          userId,
          {
            emailEnabled: true,
            slackEnabled: true,
            slackWebhookUrl: 'https://hooks.slack.com/test',
            notificationsEnabled: true,
          },
          {
            userId,
            emailEnabled: true,
            slackEnabled: true,
            slackWebhookUrl: 'https://hooks.slack.com/test',
            discordEnabled: false,
            discordWebhookUrl: undefined,
            notificationsEnabled: true,
          },
        );
      });

      it('알림을 완전히 비활성화한다', async () => {
        // Arrange
        const userId = 1;
        const dto: UpdateUserNotificationSettingsDto = {
          emailEnabled: false,
          slackEnabled: false,
          slackWebhookUrl: null,
          notificationsEnabled: false,
        };
        const mockUpdatedSettings = createMockUserSettings(dto);

        mockNotificationRepository.upsertUserNotificationSettings.mockResolvedValue(
          mockUpdatedSettings,
        );

        // Act
        const result = await service.updateUserNotificationSettings(
          userId,
          dto,
        );

        // Assert
        expect(result).toEqual(mockUpdatedSettings);
      });
    });
  });

  describe('deleteNotification', () => {
    describe('개별 알림 삭제', () => {
      it('사용자의 알림을 성공적으로 삭제한다', async () => {
        // Arrange
        const userId = 1;
        const notificationId = 1;
        const mockNotification = createMockNotification();

        mockNotificationRepository.findNotificationById.mockResolvedValue(
          mockNotification,
        );
        mockNotificationRepository.deleteNotification.mockResolvedValue(
          mockNotification,
        );

        // Act
        const result = await service.deleteNotification(userId, notificationId);

        // Assert
        expect(result.message).toContain('알림이 삭제');
        expect(
          mockNotificationRepository.deleteNotification,
        ).toHaveBeenCalledWith(notificationId);
      });
    });
  });

  describe('deleteAllUserNotifications', () => {
    it('사용자의 모든 알림을 삭제하고 삭제된 개수를 반환한다', async () => {
      // Arrange
      const userId = 1;
      const deleteCount = 5;
      mockNotificationRepository.deleteAllUserNotifications.mockResolvedValue({
        count: deleteCount,
      });

      // Act
      const result = await service.deleteAllUserNotifications(userId);

      // Assert
      expect(result.count).toBe(deleteCount);
      expect(result.message).toContain('모든 알림이 삭제');
      expect(
        mockNotificationRepository.deleteAllUserNotifications,
      ).toHaveBeenCalledWith(userId);
    });

    it('삭제할 알림이 없어도 정상적으로 동작한다', async () => {
      // Arrange
      const userId = 1;
      mockNotificationRepository.deleteAllUserNotifications.mockResolvedValue({
        count: 0,
      });

      // Act
      const result = await service.deleteAllUserNotifications(userId);

      // Assert
      expect(result.count).toBe(0);
      expect(result.message).toContain('모든 알림이 삭제');
    });
  });
});
