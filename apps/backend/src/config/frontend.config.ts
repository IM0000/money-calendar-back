import { registerAs } from '@nestjs/config';

export const frontendConfig = registerAs('frontend', () => ({
  baseUrl: process.env.FRONTEND_URL,
}));
