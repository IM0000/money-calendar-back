import { emailValidationSchema } from './email.validation';
import { oauthValidationSchema } from './oauth.validation';
import { jwtValidationSchema } from './jwt.validation';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  ...emailValidationSchema,
  ...oauthValidationSchema,
  ...jwtValidationSchema,
});
