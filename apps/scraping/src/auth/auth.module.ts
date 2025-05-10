// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { ingestJwtConfig } from '../config/ingest-jwt.config';

@Module({
  imports: [ConfigModule.forFeature(ingestJwtConfig)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
