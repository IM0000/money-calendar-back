// /auth/auth.controller.ts

import { AuthService } from './auth.service';
import { Controller, Get, Query, Res, Param, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthStrategy } from './oauth/oauth-strategy.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    @Inject('OAUTH_STRATEGIES') private readonly strategies: OAuthStrategy[],
  ) {}

  /**
   * OAuth 로그인 요청 처리 (공통 엔드포인트)
   * @param provider OAuth 제공자 이름
   * @param res 응답 객체
   */
  @Get(':provider')
  async oauthLogin(@Param('provider') provider: string, @Res() res: any) {
    const strategy = this.strategies.find(
      (strat) => strat.provider === provider,
    );
    if (!strategy) {
      throw new Error(`'${provider}'는 지원하지 않는 인증 기관입니다.`);
    }
    const redirectUri = this.configService.get<string>(
      `${provider.toUpperCase()}_CALLBACK_URL`,
    );
    const authUrl = strategy.getAuthUrl(redirectUri);
    res.redirect(authUrl);
  }

  /**
   * OAuth 콜백 처리 (공통 엔드포인트)
   * @param provider OAuth 제공자 이름
   * @param query OAuth 제공자로부터 받은 쿼리 파라미터
   * @param res 응답 객체
   */
  @Get(':provider/callback')
  async oauthCallback(
    @Param('provider') provider: string,
    @Query() query: any,
    @Res() res: any,
  ) {
    try {
      const { token, user } = await this.authService.loginWithOAuth(
        provider,
        query,
      );
      res.json({ token, user });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
