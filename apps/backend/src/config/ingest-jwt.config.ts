import { registerAs } from '@nestjs/config';

export const ingestJwtConfig = registerAs('ingestJwt', () => ({
  secret: process.env.INGEST_JWT_SECRET,
}));
