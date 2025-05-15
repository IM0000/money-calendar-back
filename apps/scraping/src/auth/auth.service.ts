import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ingestJwtConfig } from '../config/ingest-jwt.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ingestJwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof ingestJwtConfig>,
    private readonly jwtService: JwtService,
  ) {}

  generateDataIngestionToken(): string {
    const payload = { type: 'ingest', sub: 'scraper', scope: 'ingest' };

    const secret = this.jwtConfiguration.secret;
    const expiresIn = this.jwtConfiguration.expiration;

    return this.jwtService.sign(payload, { secret, expiresIn });
  }
}
