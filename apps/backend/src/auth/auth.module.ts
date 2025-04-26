// /auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { OAuthGuardFactory } from './strategies/oauth-strategy.factory';
import { GoogleStrategy } from './strategies/google.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';
import { DynamicAuthGuard } from './guard/dynamic-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '../config/jwt.config';
import { googleConfig } from '../config/google.config';
import { appleConfig } from '../config/apple.config';
import { kakaoConfig } from '../config/kakao.config';
import { discordConfig } from '../config/discord.config';
import { SharedModule } from '../shared/shared.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    SharedModule,
    UsersModule,
    EmailModule,
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleConfig),
    ConfigModule.forFeature(appleConfig),
    ConfigModule.forFeature(kakaoConfig),
    ConfigModule.forFeature(discordConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OAuthGuardFactory,
    DynamicAuthGuard,
    JwtStrategy,
    GoogleStrategy,
    // AppleStrategy,
    KakaoStrategy,
    DiscordStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
