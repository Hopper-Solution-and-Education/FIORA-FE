import { AccountType, Currency } from '@prisma/client';
import Joi from 'joi';

export const accountCreateBody = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Account name is invalid',
    'any.required': 'Account name is required',
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
    )
    .messages({
      'string.empty': 'Account type is invalid',
      'any.required': 'Account type is required',
      'any.only': 'Account type is invalid',
    }),
  currency: Joi.string().valid(Currency.VND, Currency.USD).required().messages({
    'any.only': 'Account currency must be either VND or USD',
    'string.empty': 'Account currency is invalid',
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
