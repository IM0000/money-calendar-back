import { ContentType } from '@prisma/client';
import { NotificationMessages, MessageContext } from './types/message.types';
import { buildEarningsNotification } from './earnings.builder';
import { buildDividendNotification } from './dividend.builder';
import { buildIndicatorNotification } from './indicator.builder';

/**
 * 콘텐츠 타입별 메시지 빌더 맵
 */
const notificationBuilders = {
  [ContentType.EARNINGS]: buildEarningsNotification,
  [ContentType.DIVIDEND]: buildDividendNotification,
  [ContentType.ECONOMIC_INDICATOR]: buildIndicatorNotification,
} as const;

/**
 * 워커에서 사용할 알림 메시지 생성 함수
 * @param context 메시지 생성에 필요한 컨텍스트 정보
 * @returns 채널별 알림 메시지
 */
export function buildNotificationMessages(
  context: MessageContext,
): NotificationMessages {
  const builder = notificationBuilders[context.contentType];

  if (!builder) {
    throw new Error(`지원하지 않는 콘텐츠 타입입니다: ${context.contentType}`);
  }

  return builder(context);
}

// 개별 빌더들도 export (필요한 경우)
export {
  buildEarningsNotification,
  buildDividendNotification,
  buildIndicatorNotification,
};

// 타입도 export
export type { NotificationMessages, MessageContext };
