import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { ContentType } from '@prisma/client';

@Injectable()
export class NotificationListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('indicator.actualChanged')
  async onIndicatorChanged({ before, after }) {
    await this.handleContentChange(
      ContentType.ECONOMIC_INDICATOR,
      before.id,
      before,
      after,
    );
  }

  @OnEvent('earnings.actualChanged')
  async onEarningsChanged({ before, after }) {
    await this.handleContentChange(
      ContentType.EARNINGS,
      before.id,
      before,
      after,
    );
  }

  private async handleContentChange<T>(
    type: ContentType,
    contentId: number,
    before: T,
    after: T,
  ) {
    const subs = await this.notificationService.findContentSubscriptions(
      type,
      contentId,
    );

    for (const sub of subs) {
      await this.notificationService.createNotification({
        contentType: type,
        contentId,
        userId: sub.userId,
        metadata: { before, after },
      });
    }
  }
}
