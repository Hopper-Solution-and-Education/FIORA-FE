import Joi from 'joi';

export const categoryBodySchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .required()
        .max(50)
        .messages({
            'string.empty': 'Category name is invalid',
            'string.pattern.base': 'Category name is invalid',
            'any.required': 'Category name is required',
        }),
    icon: Joi.string()
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .optional()
        .allow(null)
        .messages({
            'string.empty': 'Category icon is invalid',
            'string.pattern.base': 'Category icon is invalid',
        }),
    description: Joi.string().optional().allow(null).messages({
        'string.empty': 'Category description is invalid',
    }),
    parentId: Joi.string().optional().allow(null).messages({
        'string.empty': 'Category parent id is invalid',
    }),
});