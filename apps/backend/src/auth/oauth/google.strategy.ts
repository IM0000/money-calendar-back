import { ErrorCodes } from '../../common/enums/error-codes.enum';
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigType } from '@nestjs/config';
import { googleConfig } from '../../config/google.config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';
import CustomOauthStrategy from './custom-oauth.strategy';

@Injectable()
export class GoogleStrategy extends CustomOauthStrategy(
  Strategy,
  OAuthProviderEnum.Google,
) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    @Inject(googleConfig.KEY)
    private readonly googleConfiguration: ConfigType<typeof googleConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientID,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      connectCallbackURL: googleConfiguration.connectCallbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    this.logger.log('GoogleStrategy.validate() called', profile);
    const { id, name, emails, provider } = profile;

    if (!id || !emails[0].value) {
      done(
        new UnauthorizedException({
          errorCode: ErrorCodes.OAUTH_001,
          errorMessage: 'Google OAuth failed',
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
