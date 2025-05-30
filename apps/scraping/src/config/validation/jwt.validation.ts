import * as Joi from 'joi';

export const jwtValidationSchema = {
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('300s'),
};
