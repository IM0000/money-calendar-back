// /config/kakao.config.ts
import { registerAs } from '@nestjs/config';

export const kakaoConfig = registerAs('kakao', () => ({
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET,
  callbackURL: process.env.KAKAO_CALLBACK_URL,
}));
