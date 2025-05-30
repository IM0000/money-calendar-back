// src/auth/jwt/jwt.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import { IngestJwtStrategy } from './ingest-jwt.strategy';
import { IngestJwtAuthGuard } from './ingest-jwt-auth.guard';
import { UsersModule } from '../../users/users.module';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    NestJwtModule.registerAsync({
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
  exports: [
    NestJwtModule,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    IngestJwtAuthGuard,
  ],
})
export class JwtModule {}
