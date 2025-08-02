import { NotificationType } from '@prisma/client';
import { NotificationMessages, MessageContext } from './types/message.types';

/**
 * 배당 알림 메시지 생성
 */
export function buildDividendNotification(
  context: MessageContext,
): NotificationMessages {
  const { currentData, previousData, notificationType } = context;

  // 회사 정보 추출
  const company = currentData?.company || { name: '회사', ticker: '' };
  const companyName = company.name || '회사';
  const ticker = company.ticker ? ` (${company.ticker})` : '';

  let subject: string;
  let content: string;

  if (notificationType === NotificationType.PAYMENT_DATE) {
    // 배당 지급일 알림
    subject = `[머니캘린더] ${companyName}${ticker} 배당 지급일`;
    content = `오늘은 ${companyName}의 배당 지급일입니다! 💰`;

    if (currentData?.dividendAmount) {
      content += `\n💵 배당금: ${currentData.dividendAmount}`;
    }
    if (currentData?.paymentDate) {
      content += `\n📅 지급일: ${new Date(
        currentData.paymentDate,
      ).toLocaleDateString()}`;
    }
  } else if (notificationType === NotificationType.DATA_CHANGED) {
    // 배당 정보 업데이트 알림
    subject = `[머니캘린더] ${companyName}${ticker} 배당 정보 변경`;
    content = `${companyName} 배당 정보가 업데이트되었습니다.`;

    if (previousData?.dividendAmount !== currentData?.dividendAmount) {
      content += `\n💵 배당금: ${previousData?.dividendAmount || '-'} → ${
        currentData?.dividendAmount || '-'
      }`;
    }
    if (previousData?.paymentDate !== currentData?.paymentDate) {
      const prevDate = previousData?.paymentDate
        ? new Date(previousData.paymentDate).toLocaleDateString()
        : '-';
      const currDate = currentData?.paymentDate
        ? new Date(currentData.paymentDate).toLocaleDateString()
        : '-';
      content += `\n📅 지급일: ${prevDate} → ${currDate}`;
    }
  } else {
    // 기본 배당 알림
    subject = `[머니캘린더] ${companyName}${ticker} 배당 알림`;
    content = `${companyName} 배당 관련 알림입니다.`;
  }

  // Discord embed 생성
  let embedColor = 0x16a34a; // 초록색 (배당)
  let embedTitle = `💰 ${companyName}${ticker} 배당 알림`;

  if (notificationType === NotificationType.PAYMENT_DATE) {
    embedColor = 0x10b981; // 밝은 초록색 (지급일)
    embedTitle = `💵 ${companyName}${ticker} 배당 지급일`;
  } else if (notificationType === NotificationType.DATA_CHANGED) {
    embedColor = 0xf59e0b; // 주황색 (변경사항)
    embedTitle = `🔄 ${companyName}${ticker} 배당 정보 변경`;
  }

  const discordFields: any[] = [];

  if (notificationType === NotificationType.PAYMENT_DATE) {
    if (currentData?.dividendAmount) {
      discordFields.push({
        name: '💵 배당금',
        value: currentData.dividendAmount,
        inline: true,
      });
    }
    if (currentData?.paymentDate) {
      discordFields.push({
        name: '📅 지급일',
        value: new Date(Number(currentData.paymentDate)).toLocaleDateString(),
        inline: true,
      });
    }
  } else if (notificationType === NotificationType.DATA_CHANGED) {
    if (previousData?.dividendAmount !== currentData?.dividendAmount) {
      discordFields.push({
        name: '💵 배당금 변경',
        value: `${previousData?.dividendAmount || '-'} → ${
          currentData?.dividendAmount || '-'
        }`,
        inline: true,
      });
    }
    if (previousData?.paymentDate !== currentData?.paymentDate) {
      const prevDate = previousData?.paymentDate
        ? new Date(Number(previousData.paymentDate)).toLocaleDateString()
        : '-';
      const currDate = currentData?.paymentDate
        ? new Date(Number(currentData.paymentDate)).toLocaleDateString()
        : '-';
      discordFields.push({
        name: '📅 지급일 변경',
        value: `${prevDate} → ${currDate}`,
        inline: true,
      });
    }
  }

  return {
    email: {
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2 style="color: #16a34a;">${subject}</h2>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #16a34a;">
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
            text: `💰 ${companyName}${ticker} 배당 알림`,
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
    discord: {
      embed: {
        title: embedTitle,
        description: content.replace(/💵|📅/g, '').trim(),
        color: embedColor,
        timestamp: new Date().toISOString(),
        fields: discordFields,
        footer: {
          text: `구독 중인 ${companyName} 관련 알림 • Money Calendar`,
        },
      },
    },
  };
}
