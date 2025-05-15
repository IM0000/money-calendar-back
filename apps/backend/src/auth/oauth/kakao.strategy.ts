import { Inject, Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { kakaoConfig } from '../../config/kakao.config';
import { ConfigType } from '@nestjs/config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';
import CustomOauthStrategy from './custom-oauth.strategy';

@Injectable()
export class KakaoStrategy extends CustomOauthStrategy(
  Strategy,
  OAuthProviderEnum.Kakao,
) {
  private readonly logger = new Logger(KakaoStrategy.name);

  constructor(
    @Inject(kakaoConfig.KEY)
    private readonly kakaoConfiguration: ConfigType<typeof kakaoConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: kakaoConfiguration.clientID,
      clientSecret: '',
      callbackURL: kakaoConfiguration.callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    this.logger.log('🚀 ~ profile:', profile);
    const { id, provider, _json } = profile;
    const user = {
      provider,
      providerId: id.toString(),
      email: _json.kakao_account.email,
      accessToken,
    };
    done(null, user);
  }
}
