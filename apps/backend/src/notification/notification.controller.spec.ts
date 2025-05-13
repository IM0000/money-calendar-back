import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ContentType } from '@prisma/client';
import { UpdateUserNotificationSettingsDto } from './dto/notification.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationService = {
    getUserNotifications: jest.fn(),
    getUnreadNotificationsCount: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteUserNotification: jest.fn(),
    getUserNotificationSettings: jest.fn(),
    updateUserNotificationSettings: jest.fn(),
    addEarningsNotification: jest.fn(),
    removeEarningsNotification: jest.fn(),
    addDividendNotification: jest.fn(),
    removeDividendNotification: jest.fn(),
    addEconomicIndicatorNotification: jest.fn(),
    removeEconomicIndicatorNotification: jest.fn(),
    getNotificationCalendar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should get notifications for a user', async () => {
      const mockResult = {
        notifications: [{ id: 1, contentType: ContentType.EARNINGS }],
        total: 1,
      };
      mockNotificationService.getUserNotifications.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getNotifications(req as any, '1', '10');

      expect(service.getUserNotifications).toHaveBeenCalledWith(1, 1, 10);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread notifications count', async () => {
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

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const mockResult = { message: '알림이 읽음으로 변경되었습니다.' };
      mockNotificationService.markAsRead.mockResolvedValue(mockResult);

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.markAsRead(req as any, '1');

      expect(service.markAsRead).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockResult = { message: '모든 알림이 읽음으로 변경되었습니다.' };
      mockNotificationService.markAllAsRead.mockResolvedValue(mockResult);

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.markAllAsRead(req as any);

      expect(service.markAllAsRead).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const mockResult = { message: '알림이 삭제되었습니다.' };
      mockNotificationService.deleteUserNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.deleteNotification(req as any, '1');

      expect(service.deleteUserNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getNotificationSettings', () => {
    it('should get notification settings', async () => {
      const mockResult = {
        emailEnabled: true,
        pushEnabled: true,
        preferredMethod: 'BOTH',
      };
      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getNotificationSettings(req as any);

      expect(service.getUserNotificationSettings).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('updateNotificationSettings', () => {
    it('should update notification settings', async () => {
      const dto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        pushEnabled: true,
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

  describe('addEarningsNotification', () => {
    it('should add earnings notification', async () => {
      const mockResult = { userId: 1, earningsId: 1 };
      mockNotificationService.addEarningsNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.addEarningsNotification(req as any, '1');

      expect(service.addEarningsNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('removeEarningsNotification', () => {
    it('should remove earnings notification', async () => {
      const mockResult = { userId: 1, earningsId: 1 };
      mockNotificationService.removeEarningsNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.removeEarningsNotification(
        req as any,
        '1',
      );

      expect(service.removeEarningsNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('addDividendNotification', () => {
    it('should add dividend notification', async () => {
      const mockResult = { userId: 1, dividendId: 1 };
      mockNotificationService.addDividendNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.addDividendNotification(req as any, '1');

      expect(service.addDividendNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('removeDividendNotification', () => {
    it('should remove dividend notification', async () => {
      const mockResult = { userId: 1, dividendId: 1 };
      mockNotificationService.removeDividendNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.removeDividendNotification(
        req as any,
        '1',
      );

      expect(service.removeDividendNotification).toHaveBeenCalledWith(1, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('addEconomicIndicatorNotification', () => {
    it('should add economic indicator notification', async () => {
      const mockResult = { userId: 1, indicatorId: 1 };
      mockNotificationService.addEconomicIndicatorNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.addEconomicIndicatorNotification(
        req as any,
        '1',
      );

      expect(service.addEconomicIndicatorNotification).toHaveBeenCalledWith(
        1,
        1,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('removeEconomicIndicatorNotification', () => {
    it('should remove economic indicator notification', async () => {
      const mockResult = { userId: 1, indicatorId: 1 };
      mockNotificationService.removeEconomicIndicatorNotification.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.removeEconomicIndicatorNotification(
        req as any,
        '1',
      );

      expect(service.removeEconomicIndicatorNotification).toHaveBeenCalledWith(
        1,
        1,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getNotificationCalendar', () => {
    it('should get notification calendar', async () => {
      const mockResult = {
        earnings: [{ id: 1, companyName: 'Apple' }],
        dividends: [{ id: 1, companyName: 'Microsoft' }],
        indicators: [{ id: 1, name: 'GDP' }],
      };
      mockNotificationService.getNotificationCalendar.mockResolvedValue(
        mockResult,
      );

      const req = { user: { id: 1, email: 'test@example.com' } };
      const result = await controller.getNotificationCalendar(req as any);

      expect(service.getNotificationCalendar).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });
  });
});
