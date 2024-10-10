// src/auth/strategies/strategy.factory.ts
import { Injectable } from '@nestjs/common';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

@Injectable()
export class OAuthGuardFactory {
  private readonly services: { [key in OAuthProviderEnum]: IAuthGuard };

  constructor() {
    this.services = {
      apple: new (AuthGuard(OAuthProviderEnum.Apple))(),
      discord: new (AuthGuard(OAuthProviderEnum.Discord))(),
      google: new (AuthGuard(OAuthProviderEnum.Google))(),
      kakao: new (AuthGuard(OAuthProviderEnum.Kakao))(),
    };
  }

  get(provider: OAuthProviderEnum) {
    return this.services[provider];
  }
}
