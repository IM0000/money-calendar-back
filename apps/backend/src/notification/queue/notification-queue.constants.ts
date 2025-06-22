import { ContentType, NotificationType } from '@prisma/client';

/**
 * 알림 큐 관련 상수
 */
export const NOTIFICATION_QUEUE_NAME = 'notification-queue';

/**
 * 알림 작업 타입
 */
export const NotificationJobType = {
  SEND_EMAIL: 'send-email',
  SEND_SLACK: 'send-slack',
} as const;

export type NotificationJobType =
  (typeof NotificationJobType)[keyof typeof NotificationJobType];

/**
 * 채널과 작업 타입 매핑
 */
export const CHANNEL_TO_JOB_TYPE_MAP = {
  EMAIL: NotificationJobType.SEND_EMAIL,
  SLACK: NotificationJobType.SEND_SLACK,
} as const;

/**
 * 지원하는 채널 목록
 */
export const SUPPORTED_CHANNELS = Object.keys(CHANNEL_TO_JOB_TYPE_MAP) as Array<
  keyof typeof CHANNEL_TO_JOB_TYPE_MAP
>;

/**
 * 큐 작업 데이터 인터페이스
 */
export interface NotificationJobData {
  notificationId: number;
  deliveryId: number; // NotificationDelivery.id
  userId: number;
  userEmail?: string;
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
}

/**
 * 큐 설정
 */
export const QUEUE_CONFIG = {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  },
} as const;
