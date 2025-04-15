import { Test, TestingModule } from '@nestjs/testing';
import { NotificationListener } from './notification.listener';
import { NotificationService } from './notification.service';
import { EmailService } from '../email/email.service';
import { ContentType } from '@prisma/client';

describe('NotificationListener', () => {
  let listener: NotificationListener;
  let notificationService: NotificationService;
  let emailService: EmailService;

  const mockNotificationService = {
    findIndicatorNotifications: jest.fn(),
    findEarningsNotifications: jest.fn(),
    getUserNotificationSettings: jest.fn(),
    createNotification: jest.fn(),
  };

  const mockEmailService = {
    sendNotificationEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationListener,
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    listener = module.get<NotificationListener>(NotificationListener);
    notificationService = module.get<NotificationService>(NotificationService);
    emailService = module.get<EmailService>(EmailService);

    // 모든 모킹 함수 초기화
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handleIndicatorChanged', () => {
    it('should process indicator change and send notifications', async () => {
      // 테스트 데이터 준비
      const eventData = {
        before: { id: 1, name: '미국 CPI', actual: '3.5%', previous: '3.7%' },
        after: { id: 1, name: '미국 CPI', actual: '3.2%', previous: '3.5%' },
      };

      const mockNotifications = [
        {
          userId: 1,
          indicatorId: 1,
          user: {
            id: 1,
            email: 'user1@example.com',
            notificationSettings: {
              emailEnabled: true,
              pushEnabled: true,
              preferredMethod: 'BOTH',
            },
          },
        },
        {
          userId: 2,
          indicatorId: 1,
          user: {
            id: 2,
            email: 'user2@example.com',
            notificationSettings: {
              emailEnabled: false,
              pushEnabled: true,
              preferredMethod: 'PUSH',
            },
          },
        },
      ];

      const userSettings1 = {
        emailEnabled: true,
        pushEnabled: true,
        preferredMethod: 'BOTH',
      };

      const userSettings2 = {
        emailEnabled: false,
        pushEnabled: true,
        preferredMethod: 'PUSH',
      };

      const createdNotification = {
        id: 100,
        userId: 1,
        contentId: 1,
        contentType: ContentType.ECONOMIC_INDICATOR,
      };

      // Mock 설정
      mockNotificationService.findIndicatorNotifications.mockResolvedValue(
        mockNotifications,
      );
      mockNotificationService.getUserNotificationSettings.mockImplementation(
        (userId) => {
          return Promise.resolve(userId === 1 ? userSettings1 : userSettings2);
        },
      );
      mockNotificationService.createNotification.mockResolvedValue(
        createdNotification,
      );
      mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

      // 메서드 실행
      await listener.handleIndicatorChanged(eventData);

      // 검증
      expect(
        mockNotificationService.findIndicatorNotifications,
      ).toHaveBeenCalledWith(eventData.before.id);

      // 두 명의 사용자에 대해 알림 생성이 호출되어야 함
      expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(
        2,
      );

      // 첫 번째 사용자에 대한 알림 생성 호출 검증
      expect(mockNotificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: eventData.before.id,
        userId: mockNotifications[0].userId,
      });

      // 사용자별 알림 설정 조회 검증
      expect(
        mockNotificationService.getUserNotificationSettings,
      ).toHaveBeenCalledTimes(2);
      expect(
        mockNotificationService.getUserNotificationSettings,
      ).toHaveBeenCalledWith(mockNotifications[0].userId);
      expect(
        mockNotificationService.getUserNotificationSettings,
      ).toHaveBeenCalledWith(mockNotifications[1].userId);

      // 이메일 알림 전송 검증 (첫 번째 사용자만 이메일 알림 활성화됨)
      expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledWith({
        subject: `${eventData.before.name} 지표 업데이트 알림`,
        content: `${eventData.before.name}의 실제값이 ${eventData.before.actual}에서 ${eventData.after.actual}로 변경되었습니다.`,
      });
    });
  });

  describe('handleEarningsChanged', () => {
    it('should process earnings change and send notifications', async () => {
      // 테스트 데이터 준비
      const eventData = {
        before: {
          id: 1,
          company: { id: 1, name: 'Apple Inc.', ticker: 'AAPL' },
          actualEPS: '1.29',
          actualRevenue: '90.15B',
        },
        after: {
          id: 1,
          company: { id: 1, name: 'Apple Inc.', ticker: 'AAPL' },
          actualEPS: '1.31',
          actualRevenue: '90.25B',
        },
      };

      const mockNotifications = [
        {
          userId: 1,
          earningsId: 1,
          user: {
            id: 1,
            email: 'user1@example.com',
            notificationSettings: {
              emailEnabled: true,
              pushEnabled: true,
              preferredMethod: 'BOTH',
            },
          },
        },
      ];

      const userSettings = {
        emailEnabled: true,
        pushEnabled: true,
        preferredMethod: 'BOTH',
      };

      const createdNotification = {
        id: 101,
        userId: 1,
        contentId: 1,
        contentType: ContentType.EARNINGS,
      };

      // Mock 설정
      mockNotificationService.findEarningsNotifications.mockResolvedValue(
        mockNotifications,
      );
      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        userSettings,
      );
      mockNotificationService.createNotification.mockResolvedValue(
        createdNotification,
      );
      mockEmailService.sendNotificationEmail.mockResolvedValue(undefined);

      // 메서드 실행
      await listener.handleEarningsChanged(eventData);

      // 검증
      expect(
        mockNotificationService.findEarningsNotifications,
      ).toHaveBeenCalledWith(eventData.before.id);

      // 알림 생성이 호출되어야 함
      expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(
        1,
      );
      expect(mockNotificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: eventData.before.id,
        userId: mockNotifications[0].userId,
      });

      // 사용자별 알림 설정 조회 검증
      expect(
        mockNotificationService.getUserNotificationSettings,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockNotificationService.getUserNotificationSettings,
      ).toHaveBeenCalledWith(mockNotifications[0].userId);

      // 이메일 알림 전송 검증
      expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledTimes(1);
      expect(mockEmailService.sendNotificationEmail).toHaveBeenCalledWith({
        subject: `${eventData.before.company.name} 실적 업데이트 알림`,
        content: expect.stringContaining(
          `${eventData.before.company.name}의 실적이 업데이트되었습니다.`,
        ),
      });
    });

    it('should not send email if email notifications are disabled', async () => {
      // 테스트 데이터 준비
      const eventData = {
        before: {
          id: 1,
          company: { id: 1, name: 'Apple Inc.', ticker: 'AAPL' },
          actualEPS: '1.29',
          actualRevenue: '90.15B',
        },
        after: {
          id: 1,
          company: { id: 1, name: 'Apple Inc.', ticker: 'AAPL' },
          actualEPS: '1.31',
          actualRevenue: '90.25B',
        },
      };

      const mockNotifications = [
        {
          userId: 1,
          earningsId: 1,
          user: {
            id: 1,
            email: 'user1@example.com',
            notificationSettings: {
              emailEnabled: false,
              pushEnabled: true,
              preferredMethod: 'PUSH',
            },
          },
        },
      ];

      const userSettings = {
        emailEnabled: false,
        pushEnabled: true,
        preferredMethod: 'PUSH',
      };

      const createdNotification = {
        id: 101,
        userId: 1,
        contentId: 1,
        contentType: ContentType.EARNINGS,
      };

      // Mock 설정
      mockNotificationService.findEarningsNotifications.mockResolvedValue(
        mockNotifications,
      );
      mockNotificationService.getUserNotificationSettings.mockResolvedValue(
        userSettings,
      );
      mockNotificationService.createNotification.mockResolvedValue(
        createdNotification,
      );

      // 메서드 실행
      await listener.handleEarningsChanged(eventData);

      // 검증
      expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(
        1,
      );
      expect(mockEmailService.sendNotificationEmail).not.toHaveBeenCalled();
    });
  });
});
