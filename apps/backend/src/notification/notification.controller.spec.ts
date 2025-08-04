import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationSSEService } from './sse/notification-sse.service';
import { JwtAuthGuard } from '../security/guards/jwt-auth.guard';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;
  let sseService: NotificationSSEService;

  // 테스트 데이터 팩토리 함수들
  const createMockRequest = (userId = 1) => ({
    user: { id: userId },
  });

  const createNotificationResponse = (overrides = {}) => ({
    notifications: [{ id: 1, userId: 1, readAt: null }],
    pagination: { total: 1, page: 1, limit: 10 },
    ...overrides,
  });

  const createNotificationSettings = (overrides = {}) => ({
    emailEnabled: true,
    slackEnabled: false,
    slackWebhookUrl: null,
    notificationsEnabled: true,
    ...overrides,
  });

  const mockNotificationService = {
    getUserNotifications: jest.fn(),
    getUnreadNotificationsCount: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    deleteAllUserNotifications: jest.fn(),
    getUserNotificationSettings: jest.fn(),
    updateUserNotificationSettings: jest.fn(),
  };

  const mockSSEService = {
    getNotificationStream: jest.fn(),
    isConnected: jest.fn(),
    testConnection: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: NotificationSSEService, useValue: mockSSEService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
    sseService = module.get<NotificationSSEService>(NotificationSSEService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 합니다', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('SSE 스트림 관련 기능', () => {
    describe('stream', () => {
      it('사용자 ID에 해당하는 SSE 스트림을 반환해야 합니다', () => {
        // Arrange
        const req = createMockRequest(1);
        const mockStream = {} as any;
        mockSSEService.getNotificationStream.mockReturnValue(mockStream);

        // Act
        const result = controller.stream(req as any);

        // Assert
        expect(mockSSEService.getNotificationStream).toHaveBeenCalledWith(1);
        expect(result).toBe(mockStream);
      });

      it('다른 사용자 ID에 대해서도 올바른 스트림을 반환해야 합니다', () => {
        // Arrange
        const req = createMockRequest(999);
        const mockStream = {} as any;
        mockSSEService.getNotificationStream.mockReturnValue(mockStream);

        // Act
        const result = controller.stream(req as any);

        // Assert
        expect(mockSSEService.getNotificationStream).toHaveBeenCalledWith(999);
        expect(result).toBe(mockStream);
      });
    });

    describe('checkSSEHealth', () => {
      it('SSE 연결이 정상일 때 healthy 상태를 반환해야 합니다', async () => {
        // Arrange
        mockSSEService.isConnected.mockReturnValue(true);
        mockSSEService.testConnection.mockResolvedValue(true);

        // Act
        const result = await controller.checkSSEHealth();

        // Assert
        expect(result.status).toBe('healthy');
        expect(result.redis.connected).toBe(true);
        expect(result.redis.pingTest).toBe(true);
        expect(result.timestamp).toBeDefined();
      });

      it('SSE 연결이 끊어진 경우 unhealthy 상태를 반환해야 합니다', async () => {
        // Arrange
        mockSSEService.isConnected.mockReturnValue(false);
        mockSSEService.testConnection.mockResolvedValue(false);

        // Act
        const result = await controller.checkSSEHealth();

        // Assert
        expect(result.status).toBe('unhealthy');
        expect(result.redis.connected).toBe(false);
        expect(result.redis.pingTest).toBe(false);
        expect(result.timestamp).toBeDefined();
      });

      it('Redis 연결은 되었지만 ping 테스트가 실패한 경우를 처리해야 합니다', async () => {
        // Arrange
        mockSSEService.isConnected.mockReturnValue(true);
        mockSSEService.testConnection.mockResolvedValue(false);

        // Act
        const result = await controller.checkSSEHealth();

        // Assert
        expect(result.status).toBe('unhealthy');
        expect(result.redis.connected).toBe(true);
        expect(result.redis.pingTest).toBe(false);
      });
    });
  });

  describe('알림 조회 기능', () => {
    describe('getNotification', () => {
      it('지정된 페이지와 크기로 사용자의 알림 목록을 반환해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = createNotificationResponse();
        mockNotificationService.getUserNotifications.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.getNotification(req as any, '1', '10');

        // Assert
        expect(service.getUserNotifications).toHaveBeenCalledWith(1, 1, 10);
        expect(result).toEqual(mockResult);
      });

      it('다른 페이지 번호와 크기로 알림을 조회할 수 있어야 합니다', async () => {
        // Arrange
        const req = createMockRequest(2);
        const mockResult = createNotificationResponse({
          pagination: { total: 25, page: 3, limit: 5 },
        });
        mockNotificationService.getUserNotifications.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.getNotification(req as any, '3', '5');

        // Assert
        expect(service.getUserNotifications).toHaveBeenCalledWith(2, 3, 5);
        expect(result).toEqual(mockResult);
      });
    });

    describe('getUnreadCount', () => {
      it('사용자의 읽지 않은 알림 개수를 반환해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { count: 5 };
        mockNotificationService.getUnreadNotificationsCount.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.getUnreadCount(req as any);

        // Assert
        expect(service.getUnreadNotificationsCount).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('읽지 않은 알림이 없는 경우 0을 반환해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { count: 0 };
        mockNotificationService.getUnreadNotificationsCount.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.getUnreadCount(req as any);

        // Assert
        expect(service.getUnreadNotificationsCount).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('알림 상태 변경 기능', () => {
    describe('markAsRead', () => {
      it('지정된 알림을 읽음 상태로 변경해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { message: '알림이 읽음으로 변경되었습니다.' };
        mockNotificationService.markAsRead.mockResolvedValue(mockResult);

        // Act
        const result = await controller.markAsRead(req as any, '1');

        // Assert
        expect(service.markAsRead).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual(mockResult);
      });

      it('다른 사용자의 알림 ID로 읽음 처리를 시도할 수 있어야 합니다', async () => {
        // Arrange
        const req = createMockRequest(2);
        const mockResult = { message: '알림이 읽음으로 변경되었습니다.' };
        mockNotificationService.markAsRead.mockResolvedValue(mockResult);

        // Act
        const result = await controller.markAsRead(req as any, '999');

        // Assert
        expect(service.markAsRead).toHaveBeenCalledWith(2, 999);
        expect(result).toEqual(mockResult);
      });
    });

    describe('markAllAsRead', () => {
      it('사용자의 모든 알림을 읽음 상태로 변경해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { message: '모든 알림을 읽음으로 변경되었습니다.' };
        mockNotificationService.markAllAsRead.mockResolvedValue(mockResult);

        // Act
        const result = await controller.markAllAsRead(req as any);

        // Assert
        expect(service.markAllAsRead).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('알림 삭제 기능', () => {
    describe('deleteNotification', () => {
      it('지정된 알림을 삭제해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { message: '알림이 삭제되었습니다.' };
        mockNotificationService.deleteNotification.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.deleteNotification(req as any, '1');

        // Assert
        expect(service.deleteNotification).toHaveBeenCalledWith(1, 1);
        expect(result).toEqual(mockResult);
      });
    });

    describe('deleteAllNotifications', () => {
      it('사용자의 모든 알림을 삭제해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { message: '모든 알림이 삭제되었습니다.', count: 3 };
        mockNotificationService.deleteAllUserNotifications.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.deleteAllNotifications(req as any);

        // Assert
        expect(service.deleteAllUserNotifications).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });

      it('삭제할 알림이 없는 경우에도 정상적으로 처리해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = { message: '모든 알림이 삭제되었습니다.', count: 0 };
        mockNotificationService.deleteAllUserNotifications.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.deleteAllNotifications(req as any);

        // Assert
        expect(service.deleteAllUserNotifications).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });
    });
  });

  describe('알림 설정 관리 기능', () => {
    describe('getNotificationSettings', () => {
      it('사용자의 알림 설정을 반환해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const mockResult = createNotificationSettings();
        mockNotificationService.getUserNotificationSettings.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.getNotificationSettings(req as any);

        // Assert
        expect(service.getUserNotificationSettings).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockResult);
      });
    });

    describe('updateNotificationSettings', () => {
      it('알림 설정을 업데이트해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const dto: UpdateUserNotificationSettingsDto = {
          emailEnabled: false,
          slackEnabled: true,
        };
        const mockResult = { id: 1, userId: 1, ...dto };
        mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.updateNotificationSettings(
          req as any,
          dto,
        );

        // Assert
        expect(service.updateUserNotificationSettings).toHaveBeenCalledWith(
          1,
          dto,
        );
        expect(result).toEqual(mockResult);
      });

      it('부분적인 설정 업데이트도 처리해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const dto: UpdateUserNotificationSettingsDto = {
          emailEnabled: true,
        };
        const mockResult = { id: 1, userId: 1, ...dto };
        mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.updateNotificationSettings(
          req as any,
          dto,
        );

        // Assert
        expect(service.updateUserNotificationSettings).toHaveBeenCalledWith(
          1,
          dto,
        );
        expect(result).toEqual(mockResult);
      });

      it('슬랙 웹훅 URL을 포함한 설정 업데이트를 처리해야 합니다', async () => {
        // Arrange
        const req = createMockRequest(1);
        const dto: UpdateUserNotificationSettingsDto = {
          slackEnabled: true,
          slackWebhookUrl: 'https://hooks.slack.com/services/test/webhook',
        };
        const mockResult = { id: 1, userId: 1, ...dto };
        mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
          mockResult,
        );

        // Act
        const result = await controller.updateNotificationSettings(
          req as any,
          dto,
        );

        // Assert
        expect(service.updateUserNotificationSettings).toHaveBeenCalledWith(
          1,
          dto,
        );
        expect(result).toEqual(mockResult);
      });
    });
  });
});
