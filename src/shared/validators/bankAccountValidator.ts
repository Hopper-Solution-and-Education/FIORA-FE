import { KYCStatus } from '@prisma/client';
import Joi from 'joi';

export const bankAccountSchema = Joi.object({
  accountNumber: Joi.string().max(50).required().messages({
    'string.empty': 'accountNumber is required',
    'string.max': 'accountNumber must be at most 50 characters',
    'any.required': 'accountNumber is required',
  }),

  accountName: Joi.string().max(100).required().messages({
    'string.empty': 'accountName is required',
    'string.max': 'accountName must be at most 100 characters',
    'any.required': 'accountName is required',
  }),

  bankName: Joi.string().max(100).required().messages({
    'string.empty': 'bankName is required',
    'string.max': 'bankName must be at most 100 characters',
    'any.required': 'bankName is required',
  }),

  SWIFT: Joi.string().max(20).required().messages({
    'string.empty': 'SWIFT code is required',
    'string.max': 'SWIFT code must be at most 20 characters',
    'any.required': 'SWIFT code is required',
  }),

  paymentRefId: Joi.string().uuid().optional().messages({
    'string.guid': 'Payment paymentRefId must be a valid UUID',
  }),

  remarks: Joi.string().optional().messages({}),

  kycId: Joi.string().uuid().required().messages({
    'string.guid': 'refId must be a valid UUID',
    'string.empty': 'Address is required',
  }),
});

export const editBankAccountSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(KYCStatus))
    .required()
    .messages({
      'any.required': 'status is required',
      'any.only': 'status must be PENDING, APPROVAL, REJECTED',
    }),

  remarks: Joi.string().optional().messages({}),

  kycId: Joi.string().uuid().required().messages({
    'string.guid': 'refId must be a valid UUID',
    'string.empty': 'Address is required',
  }),
});
