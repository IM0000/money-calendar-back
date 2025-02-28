import { Injectable } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';

@Injectable()
export class OAuthService {
  constructor(private googleStrategy: GoogleStrategy) {}

  getAuthUrl(provider: string, redirectUri: string): string {
    if (provider === 'google') {
      return this.googleStrategy.getAuthUrl(redirectUri);
    }
    throw new Error('Unsupported provider');
  }

  async authenticate(provider: string, query: any): Promise<any> {
    if (provider === 'google') {
      return this.googleStrategy.authenticate(query);
    }
    throw new Error('Unsupported provider');
  }
}
