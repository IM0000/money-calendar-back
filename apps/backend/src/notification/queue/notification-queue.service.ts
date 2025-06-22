import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  NOTIFICATION_QUEUE_NAME,
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
    @InjectQueue(NOTIFICATION_QUEUE_NAME)
    private readonly notificationQueue: Queue<NotificationJobData>,
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

      await this.notificationQueue.add(NotificationJobType.SEND_EMAIL, {
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

      await this.notificationQueue.add(NotificationJobType.SEND_SLACK, {
        ...baseJobData,
        deliveryId: slackDelivery.id,
      });

      this.logger.log(
        `슬랙 작업 추가: 사용자 ${data.userId}, 알림 ${data.contentType} ${data.contentId}, 배송 ${slackDelivery.id}`,
      );
    }
  }

  /**
   * 큐 상태 조회
   */
  async getQueueStatus(): Promise<{
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }> {
    const [waiting, active, completed, failed] = await Promise.all([
      this.notificationQueue.getWaiting(),
      this.notificationQueue.getActive(),
      this.notificationQueue.getCompleted(),
      this.notificationQueue.getFailed(),
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
  async retryFailedJobs(): Promise<number> {
    const failedJobs = await this.notificationQueue.getFailed();
    let retryCount = 0;

    for (const job of failedJobs) {
      try {
        await job.retry();
        retryCount++;
      } catch (error) {
        this.logger.error(`작업 재시도 실패: ${job.id}`, error);
      }
    }

    this.logger.log(`${retryCount}개의 실패한 작업을 재시도했습니다.`);
    return retryCount;
  }
}
