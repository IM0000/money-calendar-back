import { ContentType, NotificationType } from '@prisma/client';

// 이메일 메시지 인터페이스
export interface EmailMessage {
  subject: string;
  html: string;
}

// 슬랙 메시지 인터페이스
export interface SlackMessage {
  text: string;
  blocks?: any[];
}

// 채널별 알림 메시지
export interface NotificationMessages {
  email: EmailMessage;
  slack: SlackMessage;
}

// 워커에서 메시지 생성 시 필요한 컨텍스트
export interface MessageContext {
  contentType: ContentType;
  notificationType: NotificationType;
  currentData: any;
  previousData?: any;
  userId: number;
}
