import { registerAs } from '@nestjs/config';

export const ingestJwtConfig = registerAs('ingestJwt', () => ({
  ingestionSecret: process.env.JWT_INGESTION_SECRET,
  expiration: process.env.JWT_EXPIRATION || '3600s',
}));
