import { NestFactory } from '@nestjs/core';
import { ScrapingModule } from './scraping.module';

async function bootstrap() {
  const app = await NestFactory.create(ScrapingModule);
  await app.listen(3001);
}
bootstrap();
