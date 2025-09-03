import { BudgetDetailType, TransactionType } from '@prisma/client';
import Joi from 'joi';

export const budgetCreateBody = Joi.object({
  fiscalYear: Joi.number().required().messages({
    'number.base': 'Fiscal year must be a number',
    'any.required': 'Fiscal year is required',
  }),
  estimatedTotalExpense: Joi.number(),
  // .required()
  // .when('currency', {
  //   is: Currency.USD,
  //   then: Joi.number().min(100).messages({
  //     'number.min': 'Estimated total expense must be at least 100 for USD',
  //   }),
  //   otherwise: Joi.number().min(2500000).messages({
  //     'number.min': 'Estimated total expense must be at least 2,500,000 for VND',
  //   }),
  // })
  // .messages({
  //   'number.base': 'Estimated total expense must be a number',
  //   'any.required': 'Estimated total expense is required',
  // }),
  estimatedTotalIncome: Joi.number(),
  // .required()
  // .when('currency', {
  //   is: Currency.USD,
  //   then: Joi.number().min(100).messages({
  //     'number.min': 'Estimated total income must be at least 100 for USD',
  //   }),
  //   otherwise: Joi.number().min(2500000).messages({
  //     'number.min': 'Estimated total income must be at least 2,500,000 for VND',
  //   }),
  // })
  // .messages({
  //   'number.base': 'Estimated total income must be a number',
  //   'any.required': 'Estimated total income is required',
  // }),
  description: Joi.string().optional().allow(''),
  currency: Joi.string().required().messages({
    'string.empty': 'Currency is invalid',
    'any.required': 'Currency is required',
  }),
});

export const budgeDashboardUpdateBody = Joi.object({
  type: Joi.string().valid(TransactionType.Expense, TransactionType.Income).required().messages({
    'string.base': 'type must be a string',
    'any.required': 'type is required',
  }),
  updateTopBudget: Joi.object()
    .pattern(
      /^m([1-9]|1[0-2])_(exp|inc)$/, // Match keys like m1_exp, m2_inc, ..., m12_exp, m12_inc
      Joi.number().min(0).required().messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be non-negative',
        'any.required': '{{#label}} is required',
      }),
    )
    .custom((value, helpers) => {
      // Custom validation to reject keys starting with 'q' or 'h'
      const invalidKeys = Object.keys(value).filter(
        (key) => key.startsWith('q') || key.startsWith('h'),
      );
      if (invalidKeys.length > 0) {
        return helpers.error('object.invalidKeys', { invalidKeys });
      }
      return value;
    }, 'reject quarter and half-year updates')
    .messages({
      'object.unknown': 'Only monthly updates (e.g., m1_exp, m2_inc) are allowed',
      'object.invalidKeys':
        'Updating {{#invalidKeys}} is not allowed. Only monthly updates (m1 to m12) are permitted.',
    })
    .required(),

  fiscalYear: Joi.string().required().messages({
    'string.base': 'fiscalYear must be a string',
    'any.required': 'fiscalYear is required',
  }),
});

export const budgetDetailsCreateBody = Joi.object({
  type: Joi.string().valid(BudgetDetailType.Expense, BudgetDetailType.Income).required().messages({
    'string.base': 'type must be a string',
    'any.required': 'type is required',
  }),
  bottomUpPlan: Joi.object()
    .pattern(
      /^m([1-9]|1[0-2])_(exp|inc)$/, // Match keys like m1_exp, m2_inc, ..., m12_exp, m12_inc
      Joi.number().min(0).required().messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be non-negative',
        'any.required': '{{#label}} is required',
      }),
    )
    .custom((value, helpers) => {
      // Custom validation to reject keys starting with 'q' or 'h'
      const invalidKeys = Object.keys(value).filter(
        (key) => key.startsWith('q') || key.startsWith('h'),
      );
      if (invalidKeys.length > 0) {
        return helpers.error('object.invalidKeys', { invalidKeys });
      }
      return value;
    }, 'reject quarter and half-year updates')
    .messages({
      'object.unknown': 'Only monthly updates (e.g., m1_exp, m2_inc) are allowed',
      'object.invalidKeys':
        'Updating {{#invalidKeys}} is not allowed. Only monthly updates (m1 to m12) are permitted.',
    })
    .required(),
  actualSumUpPlan: Joi.object()
    .pattern(
      /^m([1-9]|1[0-2])_(exp|inc)$/, // Match keys like m1_exp, m2_inc, ..., m12_exp, m12_inc
      Joi.number().min(0).required().messages({
        'number.base': '{{#label}} must be a number',
        'number.min': '{{#label}} must be non-negative',
        'any.required': '{{#label}} is required',
      }),
    )
    .custom((value, helpers) => {
      // Custom validation to reject keys starting with 'q' or 'h'
      const invalidKeys = Object.keys(value).filter(
        (key) => key.startsWith('q') || key.startsWith('h'),
      );
      if (invalidKeys.length > 0) {
        return helpers.error('object.invalidKeys', { invalidKeys });
      }
      return value;
    }, 'reject quarter and half-year updates')
    .messages({
      'object.unknown': 'Only monthly updates (e.g., m1_exp, m2_inc) are allowed',
      'object.invalidKeys':
        'Updating {{#invalidKeys}} is not allowed. Only monthly updates (m1 to m12) are permitted.',
    })
    .required(),
  categoryId: Joi.string().required().messages({
    'string.base': 'categoryId must be a string',
    'any.required': 'categoryId is required',
  }),
  fiscalYear: Joi.string().required().messages({
    'string.base': 'fiscalYear must be a string',
    'any.required': 'fiscalYear is required',
  }),
});

export const budgetDetailsDeleteBody = Joi.object({
  categoryId: Joi.string().required().messages({
    'string.base': 'categoryId must be a string',
    'any.required': 'categoryId is required',
  }),
  fiscalYear: Joi.string().required().messages({
    'string.base': 'fiscalYear must be a string',
    'any.required': 'fiscalYear is required',
  }),
  type: Joi.string().valid(BudgetDetailType.Expense, BudgetDetailType.Income).required().messages({
    'string.base': 'type must be a string',
    'any.required': 'type is required',
  }),
});
