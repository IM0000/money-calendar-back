import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'], // 모든 로그 레벨 활성화
    });

    const port = process.env.SERVER_PORT ?? 3001;
    await app.listen(port);
    logger.log(`Scraping service is running on port ${port}`);
  } catch (error) {
    logger.error(
      `Error starting scraping service: ${error.message}`,
      error.stack,
    );
  }
}
bootstrap();
