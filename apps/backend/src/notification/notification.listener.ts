import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { ContentType, NotificationType } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service';

/**
 * BigInt를 문자열로 변환하여 JSON 직렬화 가능하게 만드는 헬퍼 함수
 */
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === 'object') {
    const serialized = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized;
  }

  return obj;
}

@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @OnEvent('indicator.actualChanged')
  async onIndicatorChanged({ before, after }) {
    const subscribers =
      await this.subscriptionService.getIndicatorGroupSubscribers(
        before.baseName,
        before.country,
      );
    for (const { userId } of subscribers) {
      await this.notificationService.createNotification({
        contentType: ContentType.ECONOMIC_INDICATOR,
        contentId: before.id,
        userId,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: serializeBigInt(before),
        currentData: serializeBigInt(after),
      });
    }
  }

  @OnEvent('earnings.actualChanged')
  async onEarningsChanged({ before, after }) {
    const subscribers = await this.subscriptionService.getCompanySubscribers(
      before.companyId,
    );
    for (const { userId } of subscribers) {
      await this.notificationService.createNotification({
        contentType: ContentType.EARNINGS,
        contentId: before.id,
        userId,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: serializeBigInt(before),
        currentData: serializeBigInt(after),
      });
    }
  }

  @OnEvent('dividend.dataChanged')
  async onDividendDataChanged({ before, after }) {
    const subscribers = await this.subscriptionService.getCompanySubscribers(
      before.companyId,
    );
    for (const { userId } of subscribers) {
      await this.notificationService.createNotification({
        contentType: ContentType.DIVIDEND,
        contentId: before.id,
        userId,
        notificationType: NotificationType.DATA_CHANGED,
        previousData: serializeBigInt(before),
        currentData: serializeBigInt(after),
      });
    }
  }
}
