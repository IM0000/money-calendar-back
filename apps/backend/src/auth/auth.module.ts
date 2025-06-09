import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OAuthGuardFactory } from './oauth/oauth-strategy.factory';
import { GoogleStrategy } from './oauth/google.strategy';
import { KakaoStrategy } from './oauth/kakao.strategy';
import { DiscordStrategy } from './oauth/discord.strategy';
import { DynamicAuthGuard } from './oauth/dynamic-auth.guard';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { googleConfig } from '../config/google.config';
import { appleConfig } from '../config/apple.config';
import { kakaoConfig } from '../config/kakao.config';
import { discordConfig } from '../config/discord.config';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from './jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    PrismaModule,
    JwtModule,
    PassportModule.register({}),
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
    GoogleStrategy,
    KakaoStrategy,
    DiscordStrategy,
  ],
  exports: [JwtModule, PassportModule, AuthService],
})
export class AuthModule {}
