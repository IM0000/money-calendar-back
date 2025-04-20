import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { EmailService } from '../email/email.service';
import { ContentType } from '@prisma/client';
import { SendNotificationEmailDto } from './dto/notification.dto';

@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  @OnEvent('indicator.actualChanged')
  async onIndicatorChanged({ before, after }) {
    await this.handleContentChange(
      ContentType.ECONOMIC_INDICATOR,
      before.id,
      before,
      after,
      ({ before, after }) => ({
        subject: `${before.name} 지표 업데이트 알림`,
        content: `${before.name} 지표가 ${after.actual}로 업데이트되었습니다.`,
      }),
    );
  }

  @OnEvent('earnings.actualChanged')
  async onEarningsChanged({ before, after }) {
    await this.handleContentChange(
      ContentType.EARNINGS,
      before.id,
      before,
      after,
      ({ before, after }) => ({
        subject: `${before.company.name} 실적 업데이트 알림`,
        content: `${before.company.name}의 실적이 업데이트되었습니다. EPS: ${after.actualEPS}, 매출: ${after.actualRevenue}`,
      }),
    );
  }

  private async handleContentChange<T>(
    type: ContentType,
    contentId: number,
    before: T,
    after: T,
    buildEmail: (ctx: {
      before: T;
      after: T;
    }) => Pick<SendNotificationEmailDto, 'subject' | 'content'>,
  ) {
    const subs = await this.notificationService.findContentSubscriptions(
      type,
      contentId,
    );

    for (const sub of subs) {
      await this.notificationService.createNotification({
        contentType: type,
        contentId,
        userId: sub.user.id,
      });

      const settings = sub.user.notificationSettings || {
        emailEnabled: true,
        preferredMethod: 'BOTH',
      };

      if (
        settings.emailEnabled &&
        ['EMAIL', 'BOTH'].includes(settings.preferredMethod)
      ) {
        const { subject, content } = buildEmail({ before, after });
        const emailDto: SendNotificationEmailDto = {
          email: sub.user.email,
          subject,
          content,
        };
        await this.emailService.sendNotificationEmail(emailDto);
      }
    }
  }
}
