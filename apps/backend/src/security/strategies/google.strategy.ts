import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigType } from '@nestjs/config';
import { googleConfig } from '../../config/google.config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';
import CustomOauthStrategy from './custom-oauth.strategy';
import {
  ERROR_CODE_MAP,
  ERROR_MESSAGE_MAP,
} from '../../common/constants/error.constant';

@Injectable()
export class GoogleStrategy extends CustomOauthStrategy(
  Strategy,
  OAuthProviderEnum.Google,
) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    @Inject(googleConfig.KEY)
    private readonly googleCfg: ConfigType<typeof googleConfig>,
  ) {
    super({
      clientID: googleCfg.clientID,
      clientSecret: googleCfg.clientSecret,
      callbackURL: googleCfg.callbackURL,
      connectCallbackURL: googleCfg.connectCallbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, provider } = profile;

    if (!id || !emails[0].value) {
      done(
        new UnauthorizedException({
          errorCode: ERROR_CODE_MAP.OAUTH_001,
          errorMessage: ERROR_MESSAGE_MAP.OAUTH_001,
        }),
      );
    }

    const user = {
      provider: provider,
      providerId: id.toString(),
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      accessToken,
    };

    done(null, user);
  }
}
