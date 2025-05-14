import { Currency } from '@prisma/client';
import Joi from 'joi';

export const budgetCreateBody = Joi.object({
  fiscalYear: Joi.number().required().messages({
    'number.base': 'Fiscal year must be a number',
    'any.required': 'Fiscal year is required',
  }),
  estimatedTotalExpense: Joi.number()
    .required()
    .when('currency', {
      is: Currency.USD,
      then: Joi.number().min(100).messages({
        'number.min': 'Estimated total expense must be at least 100 for USD',
      }),
      otherwise: Joi.number().min(2500000).messages({
        'number.min': 'Estimated total expense must be at least 2,500,000 for VND',
      }),
    })
    .messages({
      'number.base': 'Estimated total expense must be a number',
      'any.required': 'Estimated total expense is required',
    }),
  estimatedTotalIncome: Joi.number()
    .required()
    .when('currency', {
      is: Currency.USD,
      then: Joi.number().min(100).messages({
        'number.min': 'Estimated total income must be at least 100 for USD',
      }),
      otherwise: Joi.number().min(2500000).messages({
        'number.min': 'Estimated total income must be at least 2,500,000 for VND',
      }),
    })
    .messages({
      'number.base': 'Estimated total income must be a number',
      'any.required': 'Estimated total income is required',
    }),
  description: Joi.string().optional().allow(''),
  currency: Joi.string().valid(Currency.USD, Currency.VND).required().messages({
    'string.empty': 'Currency is invalid',
    'any.required': 'Currency is required',
  }),
});
