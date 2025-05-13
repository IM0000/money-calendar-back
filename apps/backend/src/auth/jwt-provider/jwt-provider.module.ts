import { ConfigModule } from '@nestjs/config';
import { jwtConfig } from '../../config/jwt.config';
import { ingestJwtConfig } from '../../config/ingest-jwt.config';
import { jwtProviders } from './jwt.provider';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(ingestJwtConfig),
  ],
  providers: [...jwtProviders],
  exports: [...jwtProviders],
})
export class JwtProviderModule {}
