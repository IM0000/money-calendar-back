import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
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
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);

    // 모든 모킹 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should return user notifications with pagination', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const page = '2';
      const limit = '5';
      const expectedResult = {
        notifications: [
          { id: 1, contentType: 'EARNINGS', contentId: 1, userId: 1 },
        ],
        total: 10,
      };

      mockNotificationService.getUserNotifications.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getNotifications(req as any, page, limit);

      expect(service.getUserNotifications).toHaveBeenCalledWith(
        1,
        Number(page),
        Number(limit),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread notifications count', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const expectedResult = { count: 5 };

      mockNotificationService.getUnreadNotificationsCount.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getUnreadCount(req as any);

      expect(service.getUnreadNotificationsCount).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const id = '5';
      const expectedResult = { message: '알림이 읽음으로 표시되었습니다.' };

      mockNotificationService.markAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAsRead(req as any, id);

      expect(service.markAsRead).toHaveBeenCalledWith(1, parseInt(id));
      expect(result).toEqual(expectedResult);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const expectedResult = {
        message: '모든 알림이 읽음으로 표시되었습니다.',
        count: 3,
      };

      mockNotificationService.markAllAsRead.mockResolvedValue(expectedResult);

      const result = await controller.markAllAsRead(req as any);

      expect(service.markAllAsRead).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteNotification', () => {
    it('should delete user notification', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const id = '5';
      const expectedResult = { message: '알림이 성공적으로 삭제되었습니다.' };

      mockNotificationService.deleteUserNotification.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.deleteNotification(req as any, id);

      expect(service.deleteUserNotification).toHaveBeenCalledWith(
        1,
        parseInt(id),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getNotificationSettings', () => {
    it('should get user notification settings', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const expectedResult = {
        emailEnabled: true,
        pushEnabled: false,
        preferredMethod: 'EMAIL',
      };

      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getNotificationSettings(req as any);

      expect(service.getUserNotificationSettings).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateNotificationSettings', () => {
    it('should update user notification settings', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };

      const updateDto: UpdateUserNotificationSettingsDto = {
        emailEnabled: false,
        pushEnabled: true,
        preferredMethod: 'PUSH',
      };

      const expectedResult = {
        userId: 1,
        ...updateDto,
      };

      mockNotificationService.updateUserNotificationSettings.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.updateNotificationSettings(
        req as any,
        updateDto,
      );

      expect(service.updateUserNotificationSettings).toHaveBeenCalledWith(
        1,
        updateDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addEarningsNotification', () => {
    it('should add earnings notification', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const id = '5';
      const expectedResult = {
        message: '실적 알림이 성공적으로 등록되었습니다.',
        notification: { userId: 1, earningsId: 5 },
      };

      mockNotificationService.addEarningsNotification.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.addEarningsNotification(req as any, id);

      expect(service.addEarningsNotification).toHaveBeenCalledWith(
        1,
        parseInt(id),
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getNotificationCalendar', () => {
    it('should get notification calendar', async () => {
      const req = {
        user: { id: 1, email: 'test@example.com' },
      };
      const expectedResult = {
        economicIndicators: [{ id: 1, name: '지표1', hasNotification: true }],
        earnings: [
          { id: 2, company: { name: '회사1' }, hasNotification: true },
        ],
      };

      mockNotificationService.getNotificationCalendar.mockResolvedValue(
        expectedResult,
      );

      const result = await controller.getNotificationCalendar(req as any);

      expect(service.getNotificationCalendar).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
