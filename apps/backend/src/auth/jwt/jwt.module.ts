// src/auth/jwt/jwt.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import { IngestJwtStrategy } from './ingest-jwt.strategy';
import { IngestJwtAuthGuard } from './ingest-jwt-auth.gurad';
import { ingestJwtConfig } from '../../config/ingest-jwt.config';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(ingestJwtConfig),

    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigType<typeof jwtConfig>) => ({
        secret: cfg.secret,
        signOptions: { expiresIn: cfg.expiration },
      }),
      inject: [jwtConfig.KEY],
    }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    IngestJwtStrategy,
    IngestJwtAuthGuard,
  ],
  exports: [JwtAuthGuard, OptionalJwtAuthGuard, IngestJwtAuthGuard],
})
export class JwtModule {}
