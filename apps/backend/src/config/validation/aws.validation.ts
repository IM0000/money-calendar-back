import * as Joi from 'joi';

export const awsValidationSchema = {
  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  EMAIL_USE_SES: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),
};
