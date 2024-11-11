// /config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  emailVerificationSecret: process.env.JWT_EMAIL_VERIFICATION_SECRET,
  expiration: process.env.JWT_EXPIRATION || '3600s',
}));
