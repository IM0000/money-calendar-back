import { registerAs } from '@nestjs/config';

export const urlConfig = registerAs('url', () => ({
  ingestApiUrl: process.env.INGEST_API_URL,
}));
