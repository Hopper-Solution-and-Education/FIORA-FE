import Joi from 'joi';

export const campaignUpsertSchema = Joi.object({
  bonus_1st_amount: Joi.number().min(0).required().messages({
    'number.base': 'Bonus 1st amount must be a number',
    'number.min': 'Bonus 1st amount must be at least {#limit}',
    'any.required': 'Bonus 1st amount is required',
  }),
  minimumWithdrawal: Joi.number().min(0).required().messages({
    'number.base': 'Minimum withdrawal must be a number',
    'number.min': 'Minimum withdrawal must be at least {#limit}',
    'any.required': 'Minimum withdrawal is required',
  }),
  isActive: Joi.boolean().required().messages({
    'boolean.base': 'Is active must be a boolean',
    'any.required': 'Is active is required',
  }),
});
