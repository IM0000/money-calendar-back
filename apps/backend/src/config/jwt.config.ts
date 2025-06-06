// /config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.REFRESH_JWT_SECRET,
  passwordResetSecret: process.env.JWT_PASSWORD_RESET_SECRET,
  expiration: process.env.JWT_EXPIRATION || '3600s',
  refreshExpiration: process.env.REFRESH_JWT_EXPIRATION || '7d',
}));
