import * as Joi from 'joi';

export const awsValidationSchema = {
  AWS_REGION: Joi.string().required(),
  EMAIL_USE_SES: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),
};
