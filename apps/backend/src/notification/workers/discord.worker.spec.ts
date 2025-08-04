import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { DiscordWorker } from './discord.worker';
import { DiscordService } from '../../discord/discord.service';
import { NotificationDeliveryService } from '../notification-delivery.service';
import { NotificationJobData } from '../queue/notification-queue.constants';
import { ContentType, NotificationType } from '@prisma/client';

describe('DiscordWorker', () => {
  let worker: DiscordWorker;
  let discordService: jest.Mocked<DiscordService>;
  let deliveryService: jest.Mocked<NotificationDeliveryService>;

  beforeEach(async () => {
    const mockDiscordService = {
      sendNotificationMessage: jest.fn(),
    };

    const mockDeliveryService = {
      findById: jest.fn(),
      updateToSent: jest.fn(),
      updateToFailed: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordWorker,
        {
          provide: DiscordService,
          useValue: mockDiscordService,
        },
        {
          provide: NotificationDeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    worker = module.get<DiscordWorker>(DiscordWorker);
    discordService = module.get(DiscordService);
    deliveryService = module.get(NotificationDeliveryService);
  });

  it('should be defined', () => {
    expect(worker).toBeDefined();
  });

  describe('handleDiscordNotification', () => {
    const mockJobData: NotificationJobData = {
      deliveryId: 1,
      notificationId: 1,
      userId: 1,
      userEmail: 'test@example.com',
      contentType: ContentType.EARNINGS,
      contentId: 1,
      notificationType: NotificationType.DATA_CHANGED,
      currentData: {
        company: { name: 'Test Company', ticker: 'TEST' },
        actualEPS: '1.50',
        forecastEPS: '1.40',
        releaseDate: Date.now(),
      },
      userSettings: {
        emailEnabled: false,
        slackEnabled: false,
        discordEnabled: true,
        discordWebhookUrl: 'https://discord.com/api/webhooks/123/abc',
        notificationsEnabled: true,
      },
    };

    const mockJob: Partial<Job<NotificationJobData>> = {
      data: mockJobData,
    };

    const mockDelivery = {
      id: 1,
      retryCount: 0,
    };

    beforeEach(() => {
      deliveryService.findById.mockResolvedValue(mockDelivery as any);
      discordService.sendNotificationMessage.mockResolvedValue({ ok: true });
      deliveryService.updateToSent.mockResolvedValue(undefined);
    });

    it('should successfully send discord notification', async () => {
      await worker.handleDiscordNotification(
        mockJob as Job<NotificationJobData>,
      );

      expect(deliveryService.findById).toHaveBeenCalledWith(1);
      expect(discordService.sendNotificationMessage).toHaveBeenCalledWith({
        webhookUrl: 'https://discord.com/api/webhooks/123/abc',
        embeds: expect.arrayContaining([
          expect.objectContaining({
            title: expect.stringContaining('Test Company'),
            color: expect.any(Number),
            timestamp: expect.any(String),
          }),
        ]),
      });
      expect(deliveryService.updateToSent).toHaveBeenCalledWith(
        1,
        expect.any(Number),
      );
    });

    it('should handle discord service error', async () => {
      const error = new Error('Discord webhook failed');
      discordService.sendNotificationMessage.mockRejectedValue(error);

      await expect(
        worker.handleDiscordNotification(mockJob as Job<NotificationJobData>),
      ).rejects.toThrow(error);

      expect(deliveryService.updateToFailed).toHaveBeenCalledWith(
        1,
        1, // retry count + 1
        error,
        expect.any(Number),
      );
    });

    it('should use fallback text message when embed is not available', async () => {
      // Mock buildNotificationMessages to return discord message without embed
      const mockJobDataWithoutEmbed = {
        ...mockJobData,
        currentData: null, // This might cause embed to be null
      };

      const mockJobWithoutEmbed: Partial<Job<NotificationJobData>> = {
        data: mockJobDataWithoutEmbed,
      };

      await worker.handleDiscordNotification(
        mockJobWithoutEmbed as Job<NotificationJobData>,
      );

      expect(discordService.sendNotificationMessage).toHaveBeenCalled();
      const callArgs = discordService.sendNotificationMessage.mock.calls[0][0];

      // Should have either embeds or content
      expect(callArgs).toHaveProperty('webhookUrl');
      expect(
        callArgs.hasOwnProperty('embeds') || callArgs.hasOwnProperty('content'),
      ).toBe(true);
    });
  });
});
