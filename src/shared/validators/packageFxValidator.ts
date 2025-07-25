import Joi from 'joi';

export const createPackageFxSchema = Joi.object({
  fxAmount: Joi.number().min(0).required().messages({
    'any.required': 'fxAmount is required',
    'number.base': 'fxAmount must be a number',
    'number.min': 'fxAmount must be a non-negative number',
  }),
  createdBy: Joi.string().optional(),
});

export const updatePackageFxSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'id is required',
    'string.base': 'id must be a string',
  }),
  fxAmount: Joi.number().min(0).required().messages({
    'any.required': 'fxAmount is required',
    'number.base': 'fxAmount must be a number',
    'number.min': 'fxAmount must be a non-negative number',
  }),
  createdBy: Joi.string().optional(),
});

export const deletePackageFxSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'id is required',
    'string.base': 'id must be a string',
  }),
});

export const getPackageFxByIdSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'id is required',
    'string.base': 'id must be a string',
  }),
});
