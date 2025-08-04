import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  EMAIL_QUEUE_NAME,
  SLACK_QUEUE_NAME,
  DISCORD_QUEUE_NAME,
  NotificationJobType,
  NotificationJobData,
} from './notification-queue.constants';
import {
  ContentType,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * 알림 큐 서비스
 * 알림 전송 작업을 큐에 추가하고 관리
 */
@Injectable()
export class NotificationQueueService {
  private readonly logger = new Logger(NotificationQueueService.name);

  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME)
    private readonly emailQueue: Queue<NotificationJobData>,
    @InjectQueue(SLACK_QUEUE_NAME)
    private readonly slackQueue: Queue<NotificationJobData>,
    @InjectQueue(DISCORD_QUEUE_NAME)
    private readonly discordQueue: Queue<NotificationJobData>,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 사용자 설정에 따라 활성화된 채널에만 알림 전송 작업 추가
   */
  async addNotificationJob(data: {
    notificationId: number;
    userId: number;
    userEmail: string;
    contentType: ContentType;
    contentId: number;
    notificationType: NotificationType;
    previousData?: any;
    currentData?: any;
    userSettings?: {
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
      discordEnabled: boolean;
      discordWebhookUrl?: string;
      notificationsEnabled: boolean;
    };
  }) {
    if (!data.userSettings?.notificationsEnabled) {
      this.logger.log(`알림 비활성화: 사용자 ${data.userId}`);
      return;
    }

    const baseJobData: Omit<NotificationJobData, 'deliveryId'> = {
      notificationId: data.notificationId,
      userId: data.userId,
      userEmail: data.userEmail,
      contentType: data.contentType,
      contentId: data.contentId,
      notificationType: data.notificationType,
      previousData: data.previousData,
      currentData: data.currentData,
      userSettings: data.userSettings,
    };

    // 이메일 전송 작업 추가
    if (data.userSettings?.emailEnabled) {
      const emailDelivery = await this.prisma.notificationDelivery.create({
        data: {
          notificationId: data.notificationId,
          channelKey: NotificationChannel.EMAIL,
          status: NotificationStatus.PENDING,
          retryCount: 0,
        },
      });

      await this.emailQueue.add(NotificationJobType.SEND_EMAIL, {
        ...baseJobData,
        deliveryId: emailDelivery.id,
      });

      this.logger.log(
        `이메일 작업 추가: 사용자 ${data.userId}, 알림 ${data.contentType} ${data.contentId}, 배송 ${emailDelivery.id}`,
      );
    }

    // 슬랙 전송 작업 추가
    if (data.userSettings?.slackEnabled && data.userSettings?.slackWebhookUrl) {
      const slackDelivery = await this.prisma.notificationDelivery.create({
        data: {
          notificationId: data.notificationId,
          channelKey: NotificationChannel.SLACK,
          status: NotificationStatus.PENDING,
          retryCount: 0,
        },
      });

      await this.slackQueue.add(NotificationJobType.SEND_SLACK, {
        ...baseJobData,
        deliveryId: slackDelivery.id,
      });

      this.logger.log(
        `슬랙 작업 추가: 사용자 ${data.userId}, 알림 ${data.contentType} ${data.contentId}, 배송 ${slackDelivery.id}`,
      );
    }

    // 디스코드 전송 작업 추가
    if (
      data.userSettings?.discordEnabled &&
      data.userSettings?.discordWebhookUrl
    ) {
      const discordDelivery = await this.prisma.notificationDelivery.create({
        data: {
          notificationId: data.notificationId,
          channelKey: NotificationChannel.DISCORD,
          status: NotificationStatus.PENDING,
          retryCount: 0,
        },
      });

      await this.discordQueue.add(NotificationJobType.SEND_DISCORD, {
        ...baseJobData,
        deliveryId: discordDelivery.id,
      });

      this.logger.log(
        `디스코드 작업 추가: 사용자 ${data.userId}, 알림 ${data.contentType} ${data.contentId}, 배송 ${discordDelivery.id}`,
      );
    }
  }

  /**
   * 큐 상태 조회
   */
  async getQueueStatus(): Promise<{
    email: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
    slack: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
    discord: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
    };
  }> {
    const [emailStats, slackStats, discordStats] = await Promise.all([
      this.getChannelQueueStatus(this.emailQueue),
      this.getChannelQueueStatus(this.slackQueue),
      this.getChannelQueueStatus(this.discordQueue),
    ]);

    return {
      email: emailStats,
      slack: slackStats,
      discord: discordStats,
    };
  }

  private async getChannelQueueStatus(
    queue: Queue<NotificationJobData>,
  ): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  /**
   * 실패한 작업 재시도
   */
  async retryFailedJobs(): Promise<{
    email: number;
    slack: number;
    discord: number;
  }> {
    const [emailRetryCount, slackRetryCount, discordRetryCount] =
      await Promise.all([
        this.retryQueueFailedJobs(this.emailQueue, 'email'),
        this.retryQueueFailedJobs(this.slackQueue, 'slack'),
        this.retryQueueFailedJobs(this.discordQueue, 'discord'),
      ]);

    return {
      email: emailRetryCount,
      slack: slackRetryCount,
      discord: discordRetryCount,
    };
  }

  private async retryQueueFailedJobs(
    queue: Queue<NotificationJobData>,
    queueName: string,
  ): Promise<number> {
    const failedJobs = await queue.getFailed();
    let retryCount = 0;

    for (const job of failedJobs) {
      try {
        await job.retry();
        retryCount++;
      } catch (error) {
        this.logger.error(`${queueName} 큐 작업 재시도 실패: ${job.id}`, error);
      }
    }

    this.logger.log(
      `${queueName} 큐: ${retryCount}개의 실패한 작업을 재시도했습니다.`,
    );
    return retryCount;
  }
}
