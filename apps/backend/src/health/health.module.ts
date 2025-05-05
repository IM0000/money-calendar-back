import { Module } from '@nestjs/common';
import {
  PrismaHealthIndicator,
  TerminusModule,
  TerminusModuleOptions,
} from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';
import { TerminusLogger } from './terminus-logger.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    TerminusModule.forRoot({
      logger: TerminusLogger,
    } as TerminusModuleOptions),
    PrismaModule,
  ],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
