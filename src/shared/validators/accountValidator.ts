import { AccountType } from '@prisma/client';
import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const accountCreateBody = Joi.object({
  name: Joi.string().pattern(excludeEmojiPattern).required().messages({
    'string.empty': 'Account name is invalid',
    'any.required': 'Account name is required',
    'string.pattern.base': 'Account name is invalid',
  }),
  type: Joi.string()
    .required()
    .valid(
      AccountType.CreditCard,
      AccountType.Debt,
      AccountType.Invest,
      AccountType.Lending,
      AccountType.CreditCard,
      AccountType.Payment,
      AccountType.Saving,
    )
    .messages({
      'string.empty': 'Account type is invalid',
      'any.required': 'Account type is required',
      'any.only': 'Account type is invalid',
    }),
  currency: Joi.string().required().messages({
    'any.only': 'Account currency must be valid',
    'string.empty': 'Account currency is invalid',
    'any.required': 'Account currency is required',
  }),
  balance: Joi.number()
    .required()
    .min(Number.MIN_SAFE_INTEGER)
    .max(Number.MAX_SAFE_INTEGER)
    .messages({
      'number.base': 'Balance must be a number',
      'any.required': 'Balance is required',
    }),
  limit: Joi.number().optional().allow(null).messages({
    'number.base': 'Limit must be a number',
  }),
  icon: Joi.string().required().messages({
    'string.empty': 'Account icon url is invalid',
    'any.required': 'Account icon is required',
  }),
  parentId: Joi.string().optional().allow(null).messages({
    'string.empty': 'Parent id is invalid',
  }),
});

export const accountUpdateBody = Joi.object({
  name: Joi.string().pattern(excludeEmojiPattern).optional().allow(null).messages({
    'string.empty': 'Account name is invalid',
    'string.pattern.base': 'Account name is invalid',
  }),
  icon: Joi.string().pattern(excludeEmojiPattern).optional().allow(null).messages({
    'string.empty': 'Account icon url is invalid',
    'string.pattern.base': 'Account icon url is invalid',
  }),
});

export const validateBlockUserId = Joi.object({
  blockUserId: Joi.string().uuid().required().messages({
    'string.empty': 'blockUserId id is required',
    'string.uuid': 'blockUserId id must be a valid UUID',
    'any.required': 'blockUserId id is required',
  }),
});

export const validateAssignUserId = Joi.object({
  assignUserId: Joi.string().uuid().required().messages({
    'string.empty': 'AssignUserId id is required',
    'string.uuid': 'AssignUserId id must be a valid UUID',
    'any.required': 'AssignUserId id is required',
  }),
});
