import { validationSchema } from './config/validation/main.validation';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ScrapingModule } from './scraping/scraping.module';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ScrapingLoggingInterceptor } from './common/interceptors/scraping-logging.interceptor';
import { IngestModule } from './ingest/ingest.module';
import { PersistenceModule } from './persistence/persistence.module';
import { TransportModule } from './transport/transport.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { jwtConfig } from './config/jwt.config';

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', NODE_ENV);
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath:
        process.env.NODE_ENV !== 'production'
          ? join(
              process.cwd(),
              'apps/scraping/src/config/env',
              `.${process.env.NODE_ENV}.env`,
            )
          : undefined,
      load: [jwtConfig],
      validationSchema,
    }),
    ScrapingModule,
    IngestModule,
    PersistenceModule,
    TransportModule,
    AuthModule,
    PrismaModule,
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
      useClass: ScrapingLoggingInterceptor,
    },
  ],
})
export class AppModule {}
