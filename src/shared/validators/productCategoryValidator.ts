import Joi from 'joi';

export const categoryProductBodySchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .required()
        .max(50)
        .messages({
            'string.empty': 'Product category name is invalid',
            'string.pattern.base': 'Product category name is invalid',
            'any.required': 'Product category name is required',
        }),
    icon: Joi.string()
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .optional()
        .allow(null)
        .messages({
            'string.empty': 'Product category icon is invalid',
            'string.pattern.base': 'Product category icon is invalid',
        }),
});
