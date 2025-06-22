import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { SlackModule } from '../slack/slack.module';
import { NotificationListener } from './notification.listener';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationTestController } from './notification-test.controller';
import { NotificationTestService } from './notification-test.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationQueueService } from './queue/notification-queue.service';
import { NotificationQueueController } from './queue/notification-queue.controller';
import { EmailWorker } from './workers/email.worker';
import { SlackWorker } from './workers/slack.worker';
import { NotificationDeliveryService } from './notification-delivery.service';
import { NotificationSSEService } from './sse/notification-sse.service';
import {
  NOTIFICATION_QUEUE_NAME,
  QUEUE_CONFIG,
} from './queue/notification-queue.constants';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    EmailModule,
    SlackModule,
    SubscriptionModule,
    BullModule.registerQueue({
      name: NOTIFICATION_QUEUE_NAME,
      defaultJobOptions: QUEUE_CONFIG.defaultJobOptions,
    }),
  ],
  controllers: [
    NotificationController,
    NotificationTestController,
    NotificationQueueController,
  ],
  providers: [
    NotificationService,
    NotificationDeliveryService,
    NotificationSSEService,
    NotificationListener,
    NotificationScheduler,
    NotificationTestService,
    NotificationQueueService,
    EmailWorker,
    SlackWorker,
  ],
  exports: [NotificationService, NotificationQueueService],
})
export class NotificationModule {}
