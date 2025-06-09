import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationService = {
    getUserNotifications: jest.fn(),
    getUnreadNotificationsCount: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    getUserNotificationSettings: jest.fn(),
    updateUserNotificationSettings: jest.fn(),
    deleteAllUserNotifications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('컨트롤러가 정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('알림 목록 조회', () => {
    it('사용자의 알림 목록을 반환한다', async () => {
      const mockResult = {
        notifications: [{ id: 1 }],
        pagination: { total: 1 },
      };
      mockNotificationService.getUserNotifications.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getNotification(req as any, '1', '10');
      expect(service.getUserNotifications).toHaveBeenCalledWith(1, 1, 10);
      expect(result).toEqual(mockResult);
    });
  });

  describe('읽지 않은 알림 개수 조회', () => {
    it('읽지 않은 알림 개수를 반환한다', async () => {
      const mockResult = { count: 5 };
      mockNotificationService.getUnreadNotificationsCount.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getUnreadCount(req as any);
      expect(service.getUnreadNotificationsCount).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('알림 읽음 처리', () => {
    it('알림을 읽음 처리한다', async () => {
      const mockResult = { message: '알림이 읽음으로 변경되었습니다.' };
      mockNotificationService.markAsRead.mockResolvedValue(mockResult);
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.markAsRead(req as any, '1');
      expect(service.markAsRead).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('모든 알림 읽음 처리', () => {
    it('모든 알림을 읽음 처리한다', async () => {
      const mockResult = { message: '모든 알림을 읽음으로 변경되었습니다.' };
      mockNotificationService.markAllAsRead.mockResolvedValue(mockResult);
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.markAllAsRead(req as any);
      expect(service.markAllAsRead).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('알림 삭제', () => {
    it('알림을 삭제한다', async () => {
      const mockResult = { message: '알림이 삭제되었습니다.' };
      mockNotificationService.deleteNotification.mockResolvedValue(mockResult);
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.deleteNotification(req as any, '1');
      expect(service.deleteNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('알림 설정 조회', () => {
    it('알림 설정을 반환한다', async () => {
      const mockResult = { emailEnabled: true, slackEnabled: false };
      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getNotificationSettings(req as any);
      expect(service.getUserNotificationSettings).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('알림 설정 업데이트', () => {
    it('알림 설정을 업데이트한다', async () => {
      const dto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        slackEnabled: true,
      };
      const mockResult = { id: 1, userId: 1, ...dto };
      mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1, email: 'test@example.com' } };
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

  describe('모든 알림 삭제', () => {
    it('모든 알림을 삭제한다', async () => {
      const mockResult = { message: '모든 알림이 삭제되었습니다.', count: 3 };
      mockNotificationService.deleteAllUserNotifications.mockResolvedValue(
        mockResult,
      );
      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.deleteAllNotifications(req as any);
      expect(service.deleteAllUserNotifications).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });
});
