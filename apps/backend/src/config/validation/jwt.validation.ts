import * as Joi from 'joi';

export const jwtValidationSchema = {
  JWT_SECRET: Joi.string().required(),
  JWT_PASSWORD_RESET_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('3600s'),
};
