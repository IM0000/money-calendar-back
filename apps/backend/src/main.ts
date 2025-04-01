import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const serverPort = process.env.SERVER_PORT ?? 3000;
  await app.listen(serverPort);
  console.log(`Backend service is running on port ${serverPort}`);
}
bootstrap();
