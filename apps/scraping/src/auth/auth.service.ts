import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ingestJwtConfig } from '../config/ingest-jwt.config';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  constructor(
    @Inject(ingestJwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof ingestJwtConfig>,
  ) {}

  generateDataIngestionToken(): string {
    const payload = { sub: 'scraper', scope: 'ingest' };

    const secret = this.jwtConfiguration.ingestionSecret;
    const expiresIn = this.jwtConfiguration.expiration;

    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }
}
