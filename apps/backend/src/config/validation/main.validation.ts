import { emailValidationSchema } from './email.validation';
import { oauthValidationSchema } from './oauth.validation';
import { jwtValidationSchema } from './jwt.validation';
import * as Joi from 'joi';
import { awsValidationSchema } from './aws.validation';

export const validationSchema = Joi.object({
  ...(process.env.NODE_ENV === 'development'
    ? emailValidationSchema
    : awsValidationSchema),
  ...oauthValidationSchema,
  ...jwtValidationSchema,
});
