import { Currency } from '@prisma/client';
import Joi from 'joi';

export const budgetCreateBody = Joi.object({
  fiscalYear: Joi.number().required().messages({
    'number.base': 'Fiscal year must be a number',
    'any.required': 'Fiscal year is required',
  }),
  estimatedTotalExpense: Joi.number().required().messages({
    'number.base': 'Estimated total expense must be a number',
    'any.required': 'Estimated total expense is required',
  }),
  estimatedTotalIncome: Joi.number().required().messages({
    'number.base': 'Estimated total income must be a number',
    'any.required': 'Estimated total income is required',
  }),
  description: Joi.string().optional().allow(null).messages({
    'string.empty': 'Description is invalid',
  }),
  icon: Joi.string().required().messages({
    'string.empty': 'Icon is invalid',
    'any.required': 'Icon is required',
  }),
  currency: Joi.string().valid(Currency.USD, Currency.VND).required().messages({
    'string.empty': 'Currency is invalid',
    'any.required': 'Currency is required',
  }),
});
