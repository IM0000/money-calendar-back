import * as Joi from 'joi';

export const urlValidationSchema = {
  INGEST_API_URL: Joi.string().required(),
};
