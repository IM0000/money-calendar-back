// /config/apple.config.ts
import { registerAs } from '@nestjs/config';

export const appleConfig = registerAs('apple', () => ({
  clientID: process.env.APPLE_CLIENT_ID,
  teamID: process.env.APPLE_TEAM_ID,
  keyID: process.env.APPLE_KEY_ID,
  privateKeyString: process.env.APPLE_PRIVATE_KEY,
  callbackURL: process.env.APPLE_CALLBACK_URL,
}));
