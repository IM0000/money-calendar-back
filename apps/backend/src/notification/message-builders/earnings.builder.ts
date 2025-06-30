import { NotificationType } from '@prisma/client';
import { NotificationMessages, MessageContext } from './types/message.types';

/**
 * 실적 알림 메시지 생성
 */
export function buildEarningsNotification(
  context: MessageContext,
): NotificationMessages {
  const { currentData, previousData, notificationType } = context;

  // 회사 정보 추출
  const company = currentData?.company || { name: '회사', ticker: '' };
  const companyName = company.name || '회사';
  const ticker = company.ticker ? ` (${company.ticker})` : '';

  let subject: string;
  let content: string;

  if (notificationType === NotificationType.RELEASE_DATE) {
    // 실적 발표일 알림
    subject = `[머니캘린더] ${companyName}${ticker} 실적 발표일`;
    content = `오늘은 ${companyName}의 실적 발표일입니다! 📊`;

    if (currentData?.forecastEPS) {
      content += `\n📊 예상 EPS: ${currentData.forecastEPS}`;
    }
    if (currentData?.forecastRevenue) {
      content += `\n💰 예상 매출: ${currentData.forecastRevenue}`;
    }
    if (currentData?.releaseDate) {
      content += `\n📅 발표일: ${new Date(
        Number(currentData.releaseDate),
      ).toLocaleDateString()}`;
    }
  } else if (notificationType === NotificationType.DATA_CHANGED) {
    // 실적 정보 업데이트 알림
    subject = `[머니캘린더] ${companyName}${ticker} 실적 정보 변경`;
    content = `${companyName} 실적 정보가 업데이트되었습니다.`;

    if (previousData?.actualEPS !== currentData?.actualEPS) {
      content += `\n📊 EPS: ${previousData?.actualEPS || '-'} → ${
        currentData?.actualEPS || '-'
      }`;
    }
    if (previousData?.actualRevenue !== currentData?.actualRevenue) {
      content += `\n💰 매출: ${previousData?.actualRevenue || '-'} → ${
        currentData?.actualRevenue || '-'
      }`;
    }
  } else {
    // 기본 실적 알림
    subject = `[머니캘린더] ${companyName}${ticker} 실적 알림`;
    content = `${companyName} 실적 관련 알림입니다.`;
  }

  return {
    email: {
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #2563eb;">${subject}</h2>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            ${content
              .split('\n')
              .map((line) => `<p style="margin: 8px 0;">${line}</p>`)
              .join('')}
          </div>
          <p style="color: #64748b; font-size: 14px;">
            이 알림을 받은 이유: ${companyName}을(를) 구독하고 있습니다.
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
            text: `📈 ${companyName}${ticker} 실적 알림`,
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
              text: `구독 중인 ${companyName} 관련 알림`,
            },
          ],
        },
      ],
    },
  };
}
