import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { AuthService } from '../auth.service';
import { appleConfig } from '../../config/apple.config';
import { ConfigType } from '@nestjs/config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';

@Injectable()
export class AppleStrategy extends PassportStrategy(
  Strategy,
  OAuthProviderEnum.Apple,
) {
  constructor(
    private readonly appleConfiguration: ConfigType<typeof appleConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: appleConfiguration.clientID,
      teamID: appleConfiguration.teamID,
      keyID: appleConfiguration.keyID,
      privateKeyString: appleConfiguration.privateKeyString,
      callbackURL: appleConfiguration.callbackURL,
      scope: ['name', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, email } = profile;
    const user = {
      email,
      name,
      accessToken,
    };
    done(null, user);
  }
}
