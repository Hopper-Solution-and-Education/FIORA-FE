import Joi from 'joi';

export const partnerBodySchema = Joi.object({
    name: Joi.string()
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .required()
        .max(50)
        .messages({
            'string.empty': 'Account name is invalid',
            'string.pattern.base': 'Account name is invalid',
            'any.required': 'Account name is required',
        }),
    email: Joi.string().email().messages({
        'string.empty': 'Account email is invalid',
        'any.required': 'Account email is required',
    }),
    logo: Joi.string()
        .pattern(/^[a-zA-Z0-9 ]+$/)
        .optional()
        .allow(null)
        .messages({
            'string.empty': 'Account logo is invalid',
            'string.pattern.base': 'Account logo is invalid',
        }),
});
