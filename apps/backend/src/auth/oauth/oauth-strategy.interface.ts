// /auth/oauth/oauth-strategy.interface.ts

export interface OAuthStrategy {
  provider: string;
  /**
   * OAuth 인증 URL을 생성하는 메서드
   * @param redirectUri OAuth 인증 후 리디렉션할 URI
   * @returns OAuth 인증 URL
   */
  getAuthUrl(redirectUri: string): string;

  /**
   * OAuth 인증을 수행하는 메서드
   * @param query OAuth 인증 후 리디렉션된 쿼리 파라미터
   * @returns 사용자 정보
   */
  authenticate(query: any): Promise<{
    provider: string;
    providerId: string;
    email: string;
  }>;
}
