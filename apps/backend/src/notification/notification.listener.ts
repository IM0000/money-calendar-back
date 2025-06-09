import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { ContentType } from '@prisma/client';
import { SubscriptionService } from '../subscription/subscription.service';

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
        metadata: { before, after },
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
        metadata: { before, after },
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
        metadata: {
          before,
          after,
          notificationType: 'DATA_CHANGED', // 배당 데이터 변경 알림임을 표시
        },
      });
    }
  }
}
