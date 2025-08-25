import { KYCMethod, KYCType } from '@prisma/client';
import Joi from 'joi';

export const eKYCSchema = Joi.object({
  fieldName: Joi.string().max(100).required().messages({
    'any.required': 'fieldName is required',
    'string.max': 'fieldName must be at most 100 characters',
  }),

  method: Joi.string()
    .valid(...Object.values(KYCMethod))
    .required()
    .messages({
      'any.required': 'method is required',
      'any.only': 'method must be one of [MANUAL, OTP]',
    }),

  verifiedBy: Joi.string().uuid().optional().messages({
    'string.guid': 'verifiedBy must be a valid UUID',
  }),

  type: Joi.string().valid(...Object.values(KYCType)),
});
