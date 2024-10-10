import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../auth.service';
import { kakaoConfig } from '../../config/kakao.config';
import { ConfigType } from '@nestjs/config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';

@Injectable()
export class KakaoStrategy extends PassportStrategy(
  Strategy,
  OAuthProviderEnum.Kakao,
) {
  constructor(
    private readonly kakaoConfiguration: ConfigType<typeof kakaoConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: kakaoConfiguration.clientID,
      clientSecret: kakaoConfiguration.clientSecret,
      callbackURL: kakaoConfiguration.callbackURL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const { id, username } = profile;
    const user = {
      id,
      username,
      accessToken,
    };
    done(null, user);
  }
}
