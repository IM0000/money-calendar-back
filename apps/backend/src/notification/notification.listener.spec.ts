import { Test, TestingModule } from '@nestjs/testing';
import { NotificationListener } from './notification.listener';
import { NotificationService } from './notification.service';
import { EmailService } from '../email/email.service';
import { ContentType } from '@prisma/client';
import { SendNotificationEmailDto } from './dto/notification.dto';

describe('NotificationListener', () => {
  let listener: NotificationListener;
  let notificationService: NotificationService;
  let emailService: EmailService;

  const mockNotificationService = {
    findContentSubscriptions: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('onIndicatorChanged', () => {
    it('should handle indicator change and send notifications', async () => {
      const mockBefore = {
        id: 1,
        name: 'GDP',
        actual: '',
        forecast: '2.2%',
      };
      const mockAfter = {
        id: 1,
        name: 'GDP',
        actual: '2.5%',
        forecast: '2.2%',
      };

      const mockSubscriptions = [
        {
          userId: 1,
          indicatorId: 1,
          user: {
            id: 1,
            email: 'user1@example.com',
            notificationSettings: {
              emailEnabled: true,
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
              preferredMethod: 'PUSH',
            },
          },
        },
      ];

      mockNotificationService.findContentSubscriptions.mockResolvedValue(
        mockSubscriptions,
      );

      await listener.onIndicatorChanged({
        before: mockBefore,
        after: mockAfter,
      });

      expect(notificationService.findContentSubscriptions).toHaveBeenCalledWith(
        ContentType.ECONOMIC_INDICATOR,
        1,
      );

      // 각 구독자에 대해 알림이 생성되어야 함
      expect(notificationService.createNotification).toHaveBeenCalledTimes(2);
      expect(notificationService.createNotification).toHaveBeenNthCalledWith(
        1,
        {
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 1,
          userId: 1,
        },
      );
      expect(notificationService.createNotification).toHaveBeenNthCalledWith(
        2,
        {
          contentType: ContentType.ECONOMIC_INDICATOR,
          contentId: 1,
          userId: 2,
        },
      );

      // 이메일 설정이 활성화된 사용자에게만 이메일이 전송되어야 함
      expect(emailService.sendNotificationEmail).toHaveBeenCalledTimes(1);
      expect(emailService.sendNotificationEmail).toHaveBeenCalledWith({
        email: 'user1@example.com',
        subject: 'GDP 지표 업데이트 알림',
        content: 'GDP 지표가 2.5%로 업데이트되었습니다.',
      });
    });
  });

  describe('onEarningsChanged', () => {
    it('should handle earnings change and send notifications', async () => {
      const mockBefore = {
        id: 1,
        company: { id: 1, name: 'Apple' },
        actualEPS: '',
        forecastEPS: '1.2',
        actualRevenue: '',
        forecastRevenue: '90000000000',
      };
      const mockAfter = {
        id: 1,
        company: { id: 1, name: 'Apple' },
        actualEPS: '1.5',
        forecastEPS: '1.2',
        actualRevenue: '95000000000',
        forecastRevenue: '90000000000',
      };

      const mockSubscriptions = [
        {
          userId: 1,
          earningsId: 1,
          user: {
            id: 1,
            email: 'user1@example.com',
            notificationSettings: {
              emailEnabled: true,
              preferredMethod: 'EMAIL',
            },
          },
        },
      ];

      mockNotificationService.findContentSubscriptions.mockResolvedValue(
        mockSubscriptions,
      );

      await listener.onEarningsChanged({
        before: mockBefore,
        after: mockAfter,
      });

      expect(notificationService.findContentSubscriptions).toHaveBeenCalledWith(
        ContentType.EARNINGS,
        1,
      );

      // 각 구독자에 대해 알림이 생성되어야 함
      expect(notificationService.createNotification).toHaveBeenCalledTimes(1);
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        contentType: ContentType.EARNINGS,
        contentId: 1,
        userId: 1,
      });

      // 이메일 설정이 활성화된 사용자에게 이메일이 전송되어야 함
      expect(emailService.sendNotificationEmail).toHaveBeenCalledTimes(1);
      expect(emailService.sendNotificationEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user1@example.com',
          subject: 'Apple 실적 업데이트 알림',
        }),
      );
    });
  });
});
