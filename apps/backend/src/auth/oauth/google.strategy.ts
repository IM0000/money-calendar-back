// /auth/oauth/google.strategy.ts

import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { OAuthStrategy } from './oauth-strategy.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy implements OAuthStrategy {
  provider = 'google';

  constructor(private configService: ConfigService) {}

  /**
   * Google OAuth 인증 URL을 생성합니다.
   * @param redirectUri OAuth 인증 후 리디렉션할 URI
   * @returns Google OAuth 인증 URL
   */
  getAuthUrl(redirectUri: string): string {
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const scope =
      'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
    return `https://accounts.google.com/o/oauth2/auth?client_id=${clientID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
  }

  /**
   * Google OAuth 인증을 수행합니다.
   * @param query OAuth 인증 후 리디렉션된 쿼리 파라미터
   * @returns 사용자 정보
   */
  async authenticate(query: any): Promise<any> {
    const authorizationCode = query.code;

    if (!authorizationCode) {
      throw new Error('Authorization code not provided');
    }

    const accessTokenResponse = await this.getAccessToken(authorizationCode);
    const userInfo = await this.getUserInfo(accessTokenResponse.access_token);

    return {
      provider: this.provider,
      providerId: userInfo.sub,
      email: userInfo.email,
    };
  }

  /**
   * Authorization Code를 사용하여 Access Token을 요청합니다.
   * @param authorizationCode OAuth 제공자로부터 받은 Authorization Code
   * @returns Access Token 및 기타 정보
   */
  private async getAccessToken(authorizationCode: string): Promise<any> {
    const tokenEndpoint = 'https://oauth2.googleapis.com/token';
    const redirectUri = this.configService.get<string>('GOOGLE_CALLBACK_URL');
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    try {
      const response = await axios.post(tokenEndpoint, null, {
        params: {
          code: authorizationCode,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }

  /**
   * Access Token을 사용하여 Google 사용자 정보를 가져옵니다.
   * @param accessToken OAuth 제공자로부터 받은 Access Token
   * @returns 사용자 정보
   */
  private async getUserInfo(accessToken: string): Promise<any> {
    const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';

    try {
      const response = await axios.get(userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }
}
