import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { NotificationListener } from './notification.listener';
import { NotificationTestController } from './notification-test.controller';
import { NotificationTestService } from './notification-test.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [NotificationController, NotificationTestController],
  providers: [
    NotificationService,
    NotificationListener,
    NotificationTestService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
