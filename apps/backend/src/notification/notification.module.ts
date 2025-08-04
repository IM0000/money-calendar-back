import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { SlackModule } from '../slack/slack.module';
import { DiscordModule } from '../discord/discord.module';
import { NotificationListener } from './notification.listener';
import { NotificationScheduler } from './notification.scheduler';
import { NotificationTestController } from './notification-test.controller';
import { NotificationTestService } from './notification-test.service';
import { SubscriptionModule } from '../subscription/subscription.module';
import { NotificationQueueService } from './queue/notification-queue.service';
import { NotificationQueueController } from './queue/notification-queue.controller';
import { EmailWorker } from './workers/email.worker';
import { SlackWorker } from './workers/slack.worker';
import { DiscordWorker } from './workers/discord.worker';
import { NotificationDeliveryService } from './notification-delivery.service';
import { NotificationSSEService } from './sse/notification-sse.service';
import { NotificationRepository } from './notification.repository';
import {
  EMAIL_QUEUE_NAME,
  SLACK_QUEUE_NAME,
  DISCORD_QUEUE_NAME,
  QUEUE_CONFIG,
  RATE_LIMITS,
} from './queue/notification-queue.constants';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    EmailModule,
    SlackModule,
    DiscordModule,
    SubscriptionModule,

    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
      defaultJobOptions: QUEUE_CONFIG.defaultJobOptions,
      limiter: RATE_LIMITS.email,
    }),
    BullModule.registerQueue({
      name: SLACK_QUEUE_NAME,
      defaultJobOptions: QUEUE_CONFIG.defaultJobOptions,
      limiter: RATE_LIMITS.slack,
    }),
    BullModule.registerQueue({
      name: DISCORD_QUEUE_NAME,
      defaultJobOptions: QUEUE_CONFIG.defaultJobOptions,
      limiter: RATE_LIMITS.discord,
    }),
  ],
  controllers: [
    NotificationController,
    NotificationTestController,
    NotificationQueueController,
  ],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationDeliveryService,
    NotificationSSEService,
    NotificationListener,
    NotificationScheduler,
    NotificationTestService,
    NotificationQueueService,
    EmailWorker,
    SlackWorker,
    DiscordWorker,
  ],
  exports: [NotificationService, NotificationQueueService],
})
export class NotificationModule {}
