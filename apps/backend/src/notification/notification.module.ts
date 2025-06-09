import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { SlackModule } from '../slack/slack.module';
import { NotificationListener } from './notification.listener';
import { DividendNotificationScheduler } from './dividend-notification.scheduler';
import { NotificationTestController } from './notification-test.controller';
import { NotificationTestService } from './notification-test.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [PrismaModule, EmailModule, SlackModule, SubscriptionModule],
  controllers: [NotificationController, NotificationTestController],
  providers: [
    NotificationService,
    NotificationListener,
    DividendNotificationScheduler,
    NotificationTestService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
