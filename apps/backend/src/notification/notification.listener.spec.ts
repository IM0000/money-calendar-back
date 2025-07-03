import { Test, TestingModule } from '@nestjs/testing';
import { NotificationListener } from './notification.listener';
import { NotificationService } from './notification.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ContentType, NotificationType } from '@prisma/client';

describe('NotificationListener', () => {
  let listener: NotificationListener;
  let notificationService: NotificationService;
  let subscriptionService: SubscriptionService;

  // 테스트 데이터 팩토리 함수들
  const createMockEarnings = (overrides = {}) => ({
    id: 1,
    companyId: 10,
    ticker: 'AAPL',
    actualEPS: '1.25',
    actualRevenue: '500M',
    ...overrides,
  });

  const createMockIndicator = (overrides = {}) => ({
    id: 2,
    baseName: 'CPI',
    country: 'USA',
    actual: '3.2',
    ...overrides,
  });

  const createMockSubscribers = (userIds: number[]) =>
    userIds.map((userId) => ({ userId }));

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('리스너가 정의되어 있어야 합니다', () => {
    // Assert
    expect(listener).toBeDefined();
  });

  describe('onEarningsChanged', () => {
    it('실적 변경 시 해당 회사 구독자들에게 알림을 생성해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockEarnings({ actualEPS: '1.10' });
      const mockAfter = createMockEarnings({ actualEPS: '1.25' });
      const mockSubscribers = createMockSubscribers([1, 2]);
      mockSubscriptionService.getCompanySubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onEarningsChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(subscriptionService.getCompanySubscribers).toHaveBeenCalledWith(
        10,
      );
      expect(notificationService.createNotification).toHaveBeenCalledTimes(2);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 1,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: mockBefore,
        currentData: mockAfter,
      });
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 2,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: mockBefore,
        currentData: mockAfter,
      });
    });

    it('구독자가 없는 회사의 실적 변경 시 알림을 생성하지 않아야 합니다', async () => {
      // Arrange
      const mockBefore = createMockEarnings();
      const mockAfter = createMockEarnings({ actualEPS: '1.50' });
      mockSubscriptionService.getCompanySubscribers.mockResolvedValue([]);

      // Act
      await listener.onEarningsChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(subscriptionService.getCompanySubscribers).toHaveBeenCalledWith(
        10,
      );
      expect(notificationService.createNotification).not.toHaveBeenCalled();
    });

    it('단일 구독자가 있는 경우 하나의 알림만 생성해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockEarnings();
      const mockAfter = createMockEarnings({ actualRevenue: '600M' });
      const mockSubscribers = createMockSubscribers([1]);
      mockSubscriptionService.getCompanySubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onEarningsChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(notificationService.createNotification).toHaveBeenCalledTimes(1);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 1,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: mockBefore,
        currentData: mockAfter,
      });
    });

    it('다른 회사 ID를 가진 실적 변경을 올바르게 처리해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockEarnings({ id: 5, companyId: 20 });
      const mockAfter = createMockEarnings({ id: 5, companyId: 20 });
      const mockSubscribers = createMockSubscribers([3, 4, 5]);
      mockSubscriptionService.getCompanySubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onEarningsChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(subscriptionService.getCompanySubscribers).toHaveBeenCalledWith(
        20,
      );
      expect(notificationService.createNotification).toHaveBeenCalledTimes(3);
    });
  });

  describe('onIndicatorChanged', () => {
    it('경제 지표 변경 시 해당 지표 그룹 구독자들에게 알림을 생성해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockIndicator({ actual: '3.1' });
      const mockAfter = createMockIndicator({ actual: '3.2' });
      const mockSubscribers = createMockSubscribers([3]);
      mockSubscriptionService.getIndicatorGroupSubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(
        subscriptionService.getIndicatorGroupSubscribers,
      ).toHaveBeenCalledWith('CPI', 'USA');
      expect(notificationService.createNotification).toHaveBeenCalledTimes(1);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: 2,
        userId: 3,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: mockBefore,
        currentData: mockAfter,
      });
    });

    it('구독자가 없는 지표 그룹의 변경 시 알림을 생성하지 않아야 합니다', async () => {
      // Arrange
      const mockBefore = createMockIndicator();
      const mockAfter = createMockIndicator({ actual: '3.5' });
      mockSubscriptionService.getIndicatorGroupSubscribers.mockResolvedValue(
        [],
      );

      // Act
      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(
        subscriptionService.getIndicatorGroupSubscribers,
      ).toHaveBeenCalledWith('CPI', 'USA');
      expect(notificationService.createNotification).not.toHaveBeenCalled();
    });

    it('여러 구독자가 있는 지표 그룹 변경 시 모든 구독자에게 알림을 생성해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockIndicator();
      const mockAfter = createMockIndicator({ actual: '2.8' });
      const mockSubscribers = createMockSubscribers([10, 20, 30]);
      mockSubscriptionService.getIndicatorGroupSubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(notificationService.createNotification).toHaveBeenCalledTimes(3);
      expect(notificationService.createNotification).toHaveBeenNthCalledWith(
        1,
        {
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 2,
          userId: 10,
          notificationType: NotificationType.DATA_CHANGED,
          previousData: mockBefore,
          currentData: mockAfter,
        },
      );
      expect(notificationService.createNotification).toHaveBeenNthCalledWith(
        2,
        {
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 2,
          userId: 20,
          notificationType: NotificationType.DATA_CHANGED,
          previousData: mockBefore,
          currentData: mockAfter,
        },
      );
      expect(notificationService.createNotification).toHaveBeenNthCalledWith(
        3,
        {
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 2,
          userId: 30,
          notificationType: NotificationType.DATA_CHANGED,
          previousData: mockBefore,
          currentData: mockAfter,
        },
      );
    });

    it('다른 국가의 동일 지표 변경을 올바르게 처리해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockIndicator({ country: 'KOR' });
      const mockAfter = createMockIndicator({ country: 'KOR', actual: '4.1' });
      const mockSubscribers = createMockSubscribers([100]);
      mockSubscriptionService.getIndicatorGroupSubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(
        subscriptionService.getIndicatorGroupSubscribers,
      ).toHaveBeenCalledWith('CPI', 'KOR');
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: 2,
        userId: 100,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: mockBefore,
        currentData: mockAfter,
      });
    });

    it('다른 지표명의 변경을 올바르게 처리해야 합니다', async () => {
      // Arrange
      const mockBefore = createMockIndicator({ baseName: 'GDP' });
      const mockAfter = createMockIndicator({ baseName: 'GDP', actual: '2.1' });
      const mockSubscribers = createMockSubscribers([200]);
      mockSubscriptionService.getIndicatorGroupSubscribers.mockResolvedValue(
        mockSubscribers,
      );

      // Act
      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      // Assert
      expect(
        subscriptionService.getIndicatorGroupSubscribers,
      ).toHaveBeenCalledWith('GDP', 'USA');
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: 2,
        userId: 200,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: mockBefore,
        currentData: mockAfter,
      });
    });
  });
});
