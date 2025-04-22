import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ScrapingModule } from './scraping/scraping.module';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ScrapingLoggingInterceptor } from './common/interceptors/scraping-logging.interceptor';

console.log('NODE_ENV:', process.env.NODE_ENV); // NODE_ENV 값 로그 출력
// const envFilePath = join(
//   __dirname,
//   'config',
//   'env',
//   `.${process.env.NODE_ENV}.env`,
// );
// console.log('Loading environment variables from:', envFilePath); // envFilePath 로그 출력

const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('NODE_ENV:', NODE_ENV);

const envFilePath = join(
  process.cwd(),
  'apps/scraping/src/env',
  `.${NODE_ENV}.env`,
);
console.log('Loading environment variables from:', envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역으로 설정
      envFilePath: [envFilePath],
    }),
    ScrapingModule,
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
