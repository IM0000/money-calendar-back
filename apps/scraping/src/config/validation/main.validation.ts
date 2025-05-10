import { jwtValidationSchema } from './jwt.validation';
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  ...jwtValidationSchema,
});
