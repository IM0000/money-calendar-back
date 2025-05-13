import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-discord';
import { AuthService } from '../auth.service';
import { discordConfig } from '../../config/discord.config';
import { ConfigType } from '@nestjs/config';
import { OAuthProviderEnum } from '../enum/oauth-provider.enum';
import CustomOauthStrategy from './custom-oauth.strategy';

@Injectable()
export class DiscordStrategy extends CustomOauthStrategy(
  Strategy,
  OAuthProviderEnum.Discord,
) {
  constructor(
    @Inject(discordConfig.KEY)
    private readonly discordConfiguration: ConfigType<typeof discordConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: discordConfiguration.clientID,
      clientSecret: discordConfiguration.clientSecret,
      callbackURL: discordConfiguration.callbackURL,
      scope: ['identify', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const { provider, id, username, email } = profile;
    const user = {
      providerId: id,
      provider,
      username,
      email,
      accessToken,
    };
    done(null, user);
  }
}
