import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';

// JWT Strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { IngestJwtStrategy } from './strategies/ingest-jwt.strategy';

// OAuth Strategies
import { GoogleStrategy } from './strategies/google.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';
// import { AppleStrategy } from './strategies/apple.strategy';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from './guards/optional-jwt-auth.guard';
import { IngestJwtAuthGuard } from './guards/ingest-jwt-auth.guard';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard';

// Factories
import { OAuthGuardFactory } from './factories/oauth-strategy.factory';

// Configs
import { googleConfig } from '../config/google.config';
import { appleConfig } from '../config/apple.config';
import { kakaoConfig } from '../config/kakao.config';
import { discordConfig } from '../config/discord.config';

// Dependencies
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule, // 사용자 검증용
    PassportModule.register({}),
    JwtModule.registerAsync({
      useFactory: (cfg: ConfigType<typeof jwtConfig>) => ({
        secret: cfg.secret,
        signOptions: { expiresIn: cfg.expiration },
      }),
      inject: [jwtConfig.KEY],
    }),
    ConfigModule.forFeature(googleConfig),
    // ConfigModule.forFeature(appleConfig),
    ConfigModule.forFeature(kakaoConfig),
    ConfigModule.forFeature(discordConfig),
  ],
  providers: [
    // JWT Strategies
    JwtStrategy,
    IngestJwtStrategy,

    // OAuth Strategies
    GoogleStrategy,
    KakaoStrategy,
    DiscordStrategy,
    // AppleStrategy,

    // Factories
    OAuthGuardFactory,

    // Guards
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    IngestJwtAuthGuard,
    DynamicAuthGuard,
  ],
  exports: [
    // 모든 Guard들 export
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    IngestJwtAuthGuard,
    DynamicAuthGuard,
    // OAuthGuardFactory도 export 추가
    OAuthGuardFactory,
  ],
})
export class SecurityModule {}
