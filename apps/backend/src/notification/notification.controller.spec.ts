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

  it('컨트롤러가 정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('stream', () => {
    it('SSE 스트림을 반환한다', () => {
      const req = { user: { id: 1 } };
      const mockStream = {} as any;

      mockSSEService.getNotificationStream.mockReturnValue(mockStream);

      const result = controller.stream(req as any);

      expect(mockSSEService.getNotificationStream).toHaveBeenCalledWith(1);
      expect(result).toBe(mockStream);
    });
  });

  describe('checkSSEHealth', () => {
    it('SSE 연결 상태를 확인한다', async () => {
      mockSSEService.isConnected.mockReturnValue(true);
      mockSSEService.testConnection.mockResolvedValue(true);

      const result = await controller.checkSSEHealth();

      expect(result.status).toBe('healthy');
      expect(result.redis.connected).toBe(true);
      expect(result.redis.pingTest).toBe(true);
      expect(result.timestamp).toBeDefined();
    });

    it('SSE 연결이 실패한 경우 unhealthy 상태를 반환한다', async () => {
      mockSSEService.isConnected.mockReturnValue(false);
      mockSSEService.testConnection.mockResolvedValue(false);

      const result = await controller.checkSSEHealth();

      expect(result.status).toBe('unhealthy');
      expect(result.redis.connected).toBe(false);
      expect(result.redis.pingTest).toBe(false);
    });
  });

  describe('getNotification', () => {
    it('사용자의 알림 목록을 반환한다', async () => {
      const mockResult = {
        notifications: [{ id: 1 }],
        pagination: { total: 1 },
      };
      mockNotificationService.getUserNotifications.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1 } };

      const result = await controller.getNotification(req as any, '1', '10');

      expect(service.getUserNotifications).toHaveBeenCalledWith(1, 1, 10);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUnreadCount', () => {
    it('읽지 않은 알림 개수를 반환한다', async () => {
      const mockResult = { count: 5 };
      mockNotificationService.getUnreadNotificationsCount.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1 } };

      const result = await controller.getUnreadCount(req as any);

      expect(service.getUnreadNotificationsCount).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('markAsRead', () => {
    it('알림을 읽음 처리한다', async () => {
      const mockResult = { message: '알림이 읽음으로 변경되었습니다.' };
      mockNotificationService.markAsRead.mockResolvedValue(mockResult);
      const req = { user: { id: 1 } };

      const result = await controller.markAsRead(req as any, '1');

      expect(service.markAsRead).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('markAllAsRead', () => {
    it('모든 알림을 읽음 처리한다', async () => {
      const mockResult = { message: '모든 알림을 읽음으로 변경되었습니다.' };
      mockNotificationService.markAllAsRead.mockResolvedValue(mockResult);
      const req = { user: { id: 1 } };

      const result = await controller.markAllAsRead(req as any);

      expect(service.markAllAsRead).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteNotification', () => {
    it('알림을 삭제한다', async () => {
      const mockResult = { message: '알림이 삭제되었습니다.' };
      mockNotificationService.deleteNotification.mockResolvedValue(mockResult);
      const req = { user: { id: 1 } };

      const result = await controller.deleteNotification(req as any, '1');

      expect(service.deleteNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteAllNotifications', () => {
    it('모든 알림을 삭제한다', async () => {
      const mockResult = { message: '모든 알림이 삭제되었습니다.', count: 3 };
      mockNotificationService.deleteAllUserNotifications.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1 } };

      const result = await controller.deleteAllNotifications(req as any);

      expect(service.deleteAllUserNotifications).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getNotificationSettings', () => {
    it('알림 설정을 반환한다', async () => {
      const mockResult = { emailEnabled: true, slackEnabled: false };
      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1 } };

      const result = await controller.getNotificationSettings(req as any);

      expect(service.getUserNotificationSettings).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateNotificationSettings', () => {
    it('알림 설정을 업데이트한다', async () => {
      const dto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        slackEnabled: true,
      };
      const mockResult = { id: 1, userId: 1, ...dto };
      mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1 } };

      const result = await controller.updateNotificationSettings(
        req as any,
        dto,
      );

      expect(service.updateUserNotificationSettings).toHaveBeenCalledWith(
        1,
        dto,
      );
      expect(result).toEqual(mockResult);
    });
  });
});
