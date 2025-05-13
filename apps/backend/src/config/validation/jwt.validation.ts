import * as Joi from 'joi';

export const jwtValidationSchema = {
  JWT_SECRET: Joi.string().required(),
  PASSWORD_RESET_JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('3600s'),
  INGEST_JWT_SECRET: Joi.string().required(),
};
