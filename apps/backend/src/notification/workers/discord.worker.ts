import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { DiscordService } from '../../discord/discord.service';
import { buildNotificationMessages, MessageContext } from '../message-builders';
import {
  DISCORD_QUEUE_NAME,
  NotificationJobData,
  NotificationJobType,
} from '../queue/notification-queue.constants';
import { NotificationDeliveryService } from '../notification-delivery.service';

/**
 * 디스코드 알림 전용 워커
 * 디스코드 전송만 담당하는 단일 책임 워커
 */
@Processor(DISCORD_QUEUE_NAME)
@Injectable()
export class DiscordWorker {
  private readonly logger = new Logger(DiscordWorker.name);

  constructor(
    private readonly discordService: DiscordService,
    private readonly notificationDeliveryService: NotificationDeliveryService,
  ) {}

  @Process(NotificationJobType.SEND_DISCORD)
  async handleDiscordNotification(job: Job<NotificationJobData>) {
    const {
      deliveryId,
      notificationId,
      userId,
      contentType,
      notificationType,
      previousData,
      currentData,
      userSettings,
    } = job.data;

    const startTime = Date.now();

    // NotificationDelivery 조회 (서비스 레이어 사용)
    const delivery = await this.notificationDeliveryService.findById(
      deliveryId,
    );

    try {
      const messageContext: MessageContext = {
        contentType,
        notificationType,
        currentData,
        previousData,
        userId,
      };

      const messages = buildNotificationMessages(messageContext);

      const discordMessage: any = {
        webhookUrl: userSettings.discordWebhookUrl,
      };

      // Discord 메시지는 embed 형태로 전송
      if (messages.discord?.embed) {
        discordMessage.embeds = [messages.discord.embed];
      } else {
        // fallback으로 일반 텍스트 메시지 사용
        discordMessage.content = messages.discord?.text || messages.slack.text;
      }

      await this.discordService.sendNotificationMessage(discordMessage);

      // 전송 성공 처리 (서비스 레이어 사용)
      await this.notificationDeliveryService.updateToSent(
        deliveryId,
        Date.now() - startTime,
      );

      this.logger.log(
        `디스코드 전송 성공: 사용자 ${userId}, 알림 ${notificationId}, 배송 ${deliveryId}`,
      );
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const newRetryCount = delivery.retryCount + 1;

      this.logger.error(
        `디스코드 전송 실패 (시도 ${newRetryCount}): 사용자 ${userId}, 알림 ${notificationId}, 배송 ${deliveryId}`,
        error,
      );

      // 전송 실패 처리 (서비스 레이어 사용)
      await this.notificationDeliveryService.updateToFailed(
        deliveryId,
        newRetryCount,
        error,
        processingTime,
      );

      throw error;
    }
  }
}