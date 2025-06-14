import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const categoryBodySchema = Joi.object({
  name: Joi.string().pattern(excludeEmojiPattern).required().max(255).messages({
    'string.empty': 'Category name is invalid',
    'string.pattern.base': 'Category name is invalid',
    'any.required': 'Category name is required',
  }),
  icon: Joi.string().pattern(excludeEmojiPattern).optional().allow('').messages({
    'string.empty': 'Category icon is invalid',
    'string.pattern.base': 'Category icon is invalid',
  }),
  description: Joi.string().optional().allow('').messages({
    'string.empty': 'Category description is invalid',
  }),
});
