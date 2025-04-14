import { Currency } from '@prisma/client';
import Joi from 'joi';

export const productItemSchema = Joi.object({
  icon: Joi.string().required().messages({
    'string.empty': 'Product item icon url is invalid',
    'any.required': 'Product item icon is required',
  }),
  name: Joi.string().required().max(50).messages({
    'string.empty': 'Product item name is invalid',
    'any.required': 'Product item name is required',
  }),
  description: Joi.string().allow('').optional(),
});

export const productSchema = Joi.object({
  icon: Joi.string().required().messages({
    'string.empty': 'Product icon url is invalid',
    'any.required': 'Product icon is required',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Product name is invalid',
    'any.required': 'Product name is required',
  }),
  category_id: Joi.string().required().messages({
    'any.required': 'Product category id is required',
    'string.empty': 'Product category id is invalid',
    'string.base': 'Product category id must be a string',
  }),
  type: Joi.string().required().messages({
    'any.required': 'Product type is required',
  }),
  currency: Joi.string().valid(Currency.VND, Currency.USD).optional().messages({
    'any.only': 'Product currency must be either VND or USD',
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is required',
  }),
  tax_rate: Joi.number().optional().allow(null).min(0).max(100).messages({
    'number.base': 'Tax rate must be a number',
    'number.min': 'Tax rate must be greater than 0',
    'number.max': 'Tax rate must be smaller than or equal 100',
    'any.required': 'Tax rate is required',
  }),
  description: Joi.string().allow('').optional(),
  items: Joi.array().items(productItemSchema).optional().messages({
    'array.base': 'Items must be an array',
    'array.items': 'Each item must be a valid product item',
  }),
});
