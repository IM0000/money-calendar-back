import { NotificationType } from '@prisma/client';
import { NotificationMessages, MessageContext } from './types/message.types';

/**
 * 경제지표 알림 메시지 생성
 */
export function buildIndicatorNotification(
  context: MessageContext,
): NotificationMessages {
  const { currentData, previousData, notificationType } = context;

  // 지표 정보 추출
  const indicatorName = currentData?.name || previousData?.name || '경제지표';
  const country = currentData?.country || previousData?.country || '';
  const countryPrefix = country ? `[${country}] ` : '';

  let subject: string;
  let content: string;

  if (notificationType === NotificationType.RELEASE_DATE) {
    // 경제지표 발표일 알림
    subject = `[머니캘린더] ${countryPrefix}${indicatorName} 발표일`;
    content = `오늘은 ${countryPrefix}${indicatorName} 지표 발표일입니다! 📊`;

    if (currentData?.forecast !== undefined) {
      content += `\n🎯 예상: ${currentData.forecast}`;
    }
    if (currentData?.previous !== undefined) {
      content += `\n📋 이전: ${currentData.previous}`;
    }
    if (currentData?.releaseDate) {
      content += `\n📅 발표일: ${new Date(
        Number(currentData.releaseDate),
      ).toLocaleDateString()}`;
    }
  } else if (notificationType === NotificationType.DATA_CHANGED) {
    // 경제지표 정보 업데이트 알림
    subject = `[머니캘린더] ${countryPrefix}${indicatorName} 정보 변경`;
    content = `${countryPrefix}${indicatorName} 지표 정보가 업데이트되었습니다.`;

    if (previousData?.actual !== currentData?.actual) {
      content += `\n📈 실제: ${previousData?.actual || '-'} → ${
        currentData?.actual || '-'
      }`;
    }
    if (previousData?.forecast !== currentData?.forecast) {
      content += `\n🎯 예상: ${previousData?.forecast || '-'} → ${
        currentData?.forecast || '-'
      }`;
    }
  } else {
    // 기본 경제지표 알림
    subject = `[머니캘린더] ${countryPrefix}${indicatorName} 알림`;
    content = `${countryPrefix}${indicatorName} 관련 알림입니다.`;
  }

  return {
    email: {
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #dc2626;">${subject}</h2>
          <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #dc2626;">
            ${content
              .split('\n')
              .map((line) => `<p style="margin: 8px 0;">${line}</p>`)
              .join('')}
          </div>
          <p style="color: #64748b; font-size: 14px;">
            이 알림을 받은 이유: ${indicatorName} 지표를 구독하고 있습니다.
          </p>
        </div>
      `,
    },
    slack: {
      text: subject,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `📊 ${countryPrefix}${indicatorName} 알림`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: content.replace(/\n/g, '\n'),
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `구독 중인 ${indicatorName} 관련 알림`,
            },
          ],
        },
      ],
    },
  };
}
