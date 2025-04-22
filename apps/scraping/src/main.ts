import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 선언되지 않은 프로퍼티 제거
      transform: true, // 요청 payload를 DTO 클래스로 자동 변환
      forbidNonWhitelisted: true, // 허용되지 않은 속성 발견 시 에러
    }),
  );

  const port = process.env.SERVER_PORT ?? 3001;
  await app.listen(port);
  logger.log(`Scraping service is running on port ${port}`);
}
bootstrap();
