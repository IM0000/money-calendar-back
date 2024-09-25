// /auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { OAUTH_STRATEGIES } from './oauth/strategies';
import { GoogleStrategy } from './oauth/google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { OAuthStrategy } from './oauth/oauth-strategy.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전역에서 ConfigService 사용 가능
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('3600s'),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        // 다른 OAuth 제공자 설정 추가 시 여기에 추가
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy,
    {
      provide: 'OAUTH_STRATEGIES',
      useFactory: (...strategies: OAuthStrategy[]) => strategies,
      inject: OAUTH_STRATEGIES,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
