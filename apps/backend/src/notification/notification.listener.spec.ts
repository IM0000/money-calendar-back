import { Test, TestingModule } from '@nestjs/testing';
import { NotificationListener } from './notification.listener';
import { NotificationService } from './notification.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ContentType } from '@prisma/client';

describe('NotificationListener', () => {
  let listener: NotificationListener;
  let notificationService: NotificationService;
  let subscriptionService: SubscriptionService;

  const mockNotificationService = {
    createNotification: jest.fn(),
  };
  const mockSubscriptionService = {
    getCompanySubscribers: jest.fn(),
    getIndicatorGroupSubscribers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationListener,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: SubscriptionService, useValue: mockSubscriptionService },
      ],
    }).compile();

    listener = module.get<NotificationListener>(NotificationListener);
    notificationService = module.get<NotificationService>(NotificationService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
    jest.clearAllMocks();
  });

  it('리스너가 정의되어 있어야 한다', () => {
    expect(listener).toBeDefined();
  });

  describe('onEarningsChanged', () => {
    it('회사 구독자에게만 알림이 생성된다', async () => {
      const mockBefore = { id: 1, companyId: 10 };
      const mockAfter = { id: 1, companyId: 10 };
      const mockSubscribers = [{ userId: 1 }, { userId: 2 }];
      mockSubscriptionService.getCompanySubscribers.mockResolvedValue(
        mockSubscribers,
      );

      await listener.onEarningsChanged({
        before: mockBefore,
        after: mockAfter,
      });

      expect(subscriptionService.getCompanySubscribers).toHaveBeenCalledWith(
        10,
      );
      expect(notificationService.createNotification).toHaveBeenCalledTimes(2);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 1,
        metadata: { before: mockBefore, after: mockAfter },
      });
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 2,
        metadata: { before: mockBefore, after: mockAfter },
      });
    });
  });

  describe('onIndicatorChanged', () => {
    it('지표 그룹 구독자에게만 알림이 생성된다', async () => {
      const mockBefore = { id: 2, baseName: 'CPI', country: 'USA' };
      const mockAfter = { id: 2, baseName: 'CPI', country: 'USA' };
      const mockSubscribers = [{ userId: 3 }];
      mockSubscriptionService.getIndicatorGroupSubscribers.mockResolvedValue(
        mockSubscribers,
      );

      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      expect(
        subscriptionService.getIndicatorGroupSubscribers,
      ).toHaveBeenCalledWith('CPI', 'USA');
      expect(notificationService.createNotification).toHaveBeenCalledTimes(1);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: 2,
        userId: 3,
        metadata: { before: mockBefore, after: mockAfter },
      });
    });
  });
});
