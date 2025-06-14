import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const categoryProductBodySchema = Joi.object({
    name: Joi.string()
        .pattern(excludeEmojiPattern)
        .required()
        .max(50)
        .messages({
            'string.empty': 'Product category name is invalid',
            'string.pattern.base': 'Product category name is invalid',
            'any.required': 'Product category name is required',
            'string.max': 'Product category name must be less than 50 characters',
        }),
    icon: Joi.string()
        .pattern(excludeEmojiPattern)
        .optional()
        .allow('')
        .messages({
            'string.empty': 'Product category icon is invalid',
            'string.pattern.base': 'Product category icon is invalid',
        }),
});
