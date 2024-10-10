// /auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { validationSchema } from './../config/validation/main.validation';
import { emailConfig } from '../config/email.config';
import { jwtConfig } from '../config/jwt.config';
import { EmailModule } from '../email/email.module';
import { googleConfig } from '../config/google.config';
import { kakaoConfig } from '../config/kakao.config';
import { appleConfig } from '../config/apple.config';
import { discordConfig } from '../config/discord.config';
import { OAuthGuardFactory } from './strategies/oauth-strategy.factory';
import { GoogleStrategy } from './strategies/google.strategy';
import { AppleStrategy } from './strategies/apple.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';
import { DynamicAuthGuard } from './guard/dynamic-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [
        emailConfig,
        jwtConfig,
        googleConfig,
        kakaoConfig,
        appleConfig,
        discordConfig,
      ],
      validationSchema,
    }),
    UsersModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OAuthGuardFactory,
    DynamicAuthGuard,
    JwtStrategy,
    GoogleStrategy,
    AppleStrategy,
    KakaoStrategy,
    DiscordStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
