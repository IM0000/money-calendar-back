// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ingestJwtConfig } from '../config/ingest-jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forFeature(ingestJwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigType<typeof ingestJwtConfig>) => ({
        secret: cfg.secret,
        signOptions: { expiresIn: cfg.expiration },
      }),
      inject: [ingestJwtConfig.KEY],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
