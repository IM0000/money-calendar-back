import { validationSchema } from './config/validation/main.validation';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { SlackModule } from './slack/slack.module';
import { ConfigModule } from '@nestjs/config';
import { emailConfig } from './config/email.config';
import { jwtConfig } from './config/jwt.config';
import { googleConfig } from './config/google.config';
import { kakaoConfig } from './config/kakao.config';
import { appleConfig } from './config/apple.config';
import { discordConfig } from './config/discord.config';
import { join } from 'path';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { frontendConfig } from './config/frontend.config';
import { CalendarModule } from './calendar/calendar.module';
import { FavoriteModule } from './favorite/favorite.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SearchModule } from './search/search.module';
import { CompanyModule } from './company/company.module';
import { NotificationModule } from './notification/notification.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { awsConfig } from './config/aws.config';
import { redisConfig } from './config/redis.config';
import { PrismaModule } from './prisma/prisma.module';
import { IngestModule } from './ingest/ingest.module';
import { BullModule } from '@nestjs/bull';
import * as cookieParser from 'cookie-parser';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', NODE_ENV);
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_DB, 10) || 0,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역으로 설정
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      // envFilePath는 개발 시에만 읽도록 분기
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? join(
              process.cwd(),
              'apps/backend/src/config/env',
              `.${process.env.NODE_ENV}.env`,
            )
          : undefined,
      load: [
        awsConfig,
        redisConfig,
        frontendConfig,
        emailConfig,
        jwtConfig,
        googleConfig,
        kakaoConfig,
        appleConfig,
        discordConfig,
      ],
      validationSchema,
    }),
    UserModule,
    AuthModule,
    EmailModule,
    SlackModule,
    CalendarModule,
    FavoriteModule,
    SubscriptionModule,
    NotificationModule,
    SearchModule,
    CompanyModule,
    HealthModule,
    TerminusModule,
    HealthModule,
    PrismaModule,
    IngestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser(process.env.COOKIE_SECRET)).forRoutes('*');
  }
}
