// /config/google.config.ts
import { registerAs } from '@nestjs/config';

export const googleConfig = registerAs('google', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  connectCallbackURL: process.env.GOOGLE_CONNECT_CALLBACK_URL,
}));
