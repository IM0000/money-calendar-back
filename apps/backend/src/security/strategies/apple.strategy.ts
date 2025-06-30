import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-apple';
import { appleConfig } from '../../config/apple.config';
import { ConfigType } from '@nestjs/config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';

@Injectable()
export class AppleStrategy extends PassportStrategy(
  Strategy,
  OAuthProviderEnum.Apple,
) {
  constructor(
    @Inject(appleConfig.KEY)
    private readonly appleCfg: ConfigType<typeof appleConfig>,
  ) {
    super({
      clientID: appleCfg.clientID,
      teamID: appleCfg.teamID,
      keyID: appleCfg.keyID,
      privateKeyString: appleCfg.privateKeyString,
      callbackURL: appleCfg.callbackURL,
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
