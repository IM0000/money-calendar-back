import * as Joi from 'joi';

export const jwtValidationSchema = {
  INGESTION_JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('3600s'),
};
