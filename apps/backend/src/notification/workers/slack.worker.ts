import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../slack/slack.service';
import { buildNotificationMessages, MessageContext } from '../message-builders';
import {
  NOTIFICATION_QUEUE_NAME,
  NotificationJobData,
  NotificationJobType,
} from '../queue/notification-queue.constants';
import { NotificationDeliveryService } from '../notification-delivery.service';

/**
 * 슬랙 알림 전용 워커
 * 슬랙 전송만 담당하는 단일 책임 워커
 */
@Processor(NOTIFICATION_QUEUE_NAME)
@Injectable()
export class SlackWorker {
  private readonly logger = new Logger(SlackWorker.name);

  constructor(
    private readonly slackService: SlackService,
    private readonly notificationDeliveryService: NotificationDeliveryService,
  ) {}

  @Process(NotificationJobType.SEND_SLACK)
  async handleSlackNotification(job: Job<NotificationJobData>) {
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

      await this.slackService.sendNotificationMessage({
        webhookUrl: userSettings.slackWebhookUrl,
        text: messages.slack.text,
        blocks: messages.slack.blocks,
      });

      // 전송 성공 처리 (서비스 레이어 사용)
      await this.notificationDeliveryService.updateToSent(
        deliveryId,
        Date.now() - startTime,
      );

      this.logger.log(
        `슬랙 전송 성공: 사용자 ${userId}, 알림 ${notificationId}, 배송 ${deliveryId}`,
      );
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const newRetryCount = delivery.retryCount + 1;

      this.logger.error(
        `슬랙 전송 실패 (시도 ${newRetryCount}): 사용자 ${userId}, 알림 ${notificationId}, 배송 ${deliveryId}`,
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
