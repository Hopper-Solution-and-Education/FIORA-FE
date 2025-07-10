import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const productItemBodySchema = Joi.object({
  icon: Joi.string().pattern(excludeEmojiPattern).required().messages({
    'string.empty': 'Product item icon url is invalid',
    'string.pattern.base': 'Product item icon url is invalid',
    'any.required': 'Product item icon is required',
  }),
  name: Joi.string().pattern(excludeEmojiPattern).required().max(50).messages({
    'string.empty': 'Product item name is invalid',
    'string.pattern.base': 'Product item name is invalid',
    'any.required': 'Product item name is required',
    'string.max': 'Product item name must be less than 50 characters',
  }),
  description: Joi.string().allow('').optional(),
});

export const productBodySchema = Joi.object({
  icon: Joi.string()
    .required()
    .messages({
      'string.empty': 'Product icon url is invalid',
      'any.required': 'Product icon is required',
    })
    .pattern(excludeEmojiPattern, 'Product icon url is invalid'),
  name: Joi.string().pattern(excludeEmojiPattern).required().max(50).messages({
    'string.empty': 'Product name is invalid',
    'string.pattern.base': 'Product name is invalid',
    'any.required': 'Product name is required',
    'string.max': 'Product name must be less than 50 characters',
  }),
  category_id: Joi.string().required().messages({
    'any.required': 'Product category id is required',
    'string.empty': 'Product category id is invalid',
    'string.base': 'Product category id must be a string',
  }),
  type: Joi.string().required().messages({
    'any.required': 'Product type is required',
  }),
  currency: Joi.string().optional().messages({
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
  items: Joi.array().items(productItemBodySchema).optional().messages({
    'array.base': 'Items must be an array',
    'array.items': 'Each item must be a valid product item',
  }),
});

export const productUpdateBodySchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Product id is invalid',
    'any.required': 'Product id is required',
  }),
  icon: Joi.string().pattern(excludeEmojiPattern).optional().allow('').messages({
    'string.empty': 'Product icon url is invalid',
    'string.pattern.base': 'Product icon url is invalid',
  }),
  name: Joi.string().pattern(excludeEmojiPattern).optional().allow('').messages({
    'string.empty': 'Product name is invalid',
    'string.pattern.base': 'Product name is invalid',
  }),
  category_id: Joi.string().optional().messages({
    'any.required': 'Product category id is required',
    'string.empty': 'Product category id is invalid',
    'string.base': 'Product category id must be a string',
  }),
  type: Joi.string().optional().messages({
    'any.required': 'Product type is required',
  }),
  price: Joi.number().min(0).optional().messages({
    'number.base': 'Price must be a number',
    'any.required': 'Price is required',
  }),
  tax_rate: Joi.number().optional().allow('').min(0).max(100).messages({
    'number.base': 'Tax rate must be a number',
    'number.min': 'Tax rate must be greater than 0',
    'number.max': 'Tax rate must be smaller than or equal 100',
    'any.required': 'Tax rate is required',
  }),
  description: Joi.string().allow('').optional(),
  items: Joi.array().items(productItemBodySchema).optional().messages({
    'array.base': 'Items must be an array',
    'array.items': 'Each item must be a valid product item',
  }),
  deleteItemsId: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Delete items id must be an array',
    'array.items': 'Each item must be a valid product item',
  }),
});
