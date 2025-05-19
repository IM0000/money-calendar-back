// /config/email.config.ts
import { registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => ({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
  from: process.env.EMAIL_FROM,
  useSes: process.env.EMAIL_USE_SES === 'true',
}));
