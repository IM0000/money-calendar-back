import * as Joi from 'joi';

export const oauthValidationSchema = {
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  KAKAO_CLIENT_ID: Joi.string().required(),
  KAKAO_CALLBACK_URL: Joi.string().required(),
  DISCORD_CLIENT_ID: Joi.string().required(),
  DISCORD_CLIENT_SECRET: Joi.string().required(),
  DISCORD_CALLBACK_URL: Joi.string().required(),
};
