import { ContentType, NotificationType } from '@prisma/client';

/**
 * 이메일 서비스 타입 정의
 */
export enum EmailServiceType {
  GMAIL = 'GMAIL',
  AWS_SES = 'AWS_SES',
}

/**
 * 알림 큐 관련 상수
 */
export const EMAIL_QUEUE_NAME = 'email-notification-queue';
export const SLACK_QUEUE_NAME = 'slack-notification-queue';
export const DISCORD_QUEUE_NAME = 'discord-notification-queue';

/**
 * 알림 작업 타입
 */
export const NotificationJobType = {
  SEND_EMAIL: 'send-email',
  SEND_SLACK: 'send-slack',
  SEND_DISCORD: 'send-discord',
} as const;

export type NotificationJobType =
  (typeof NotificationJobType)[keyof typeof NotificationJobType];

/**
 * 채널과 작업 타입 매핑
 */
export const CHANNEL_TO_JOB_TYPE_MAP = {
  EMAIL: NotificationJobType.SEND_EMAIL,
  SLACK: NotificationJobType.SEND_SLACK,
  DISCORD: NotificationJobType.SEND_DISCORD,
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
    discordEnabled: boolean;
    discordWebhookUrl?: string;
    notificationsEnabled: boolean;
  };
}

/**
 * 서비스별 Rate Limit 설정
 */
export const EMAIL_SERVICE_LIMITS = {
  [EmailServiceType.GMAIL]: {
    max: 1, // Gmail SMTP 안전 설정 (초당 1개)
    duration: 1000,
    dailyLimit: 500,
    hourlyLimit: 100,
  },
  [EmailServiceType.AWS_SES]: {
    max: 10, // AWS SES 프로덕션 안전 설정 (초당 10개)
    duration: 1000,
    dailyLimit: 50000, // 충분한 여유
    hourlyLimit: 2000,
  },
} as const;

/**
 * 서비스 감지 함수 (기존 EMAIL_USE_SES 환경변수 사용)
 */
export function getEmailServiceType(): EmailServiceType {
  const useSes = process.env.EMAIL_USE_SES === 'true';

  return useSes ? EmailServiceType.AWS_SES : EmailServiceType.GMAIL;
}

/**
 * 동적 Rate Limit 함수
 */
export function getEmailRateLimit(): { max: number; duration: number } {
  const serviceType = getEmailServiceType();
  return EMAIL_SERVICE_LIMITS[serviceType];
}

/**
 * 현재 사용 중인 서비스의 설정
 */
export const CURRENT_EMAIL_CONFIG = EMAIL_SERVICE_LIMITS[getEmailServiceType()];

/**
 * 동적 Rate Limit 설정
 */
export const RATE_LIMITS = {
  email: getEmailRateLimit(), // 동적으로 설정
  slack: {
    max: 1, // Slack webhook 제한
    duration: 1000, // 1초
  },
  discord: {
    max: 5, // Discord webhook 제한 (Slack보다 관대함)
    duration: 1000, // 1초
  },
} as const;

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
