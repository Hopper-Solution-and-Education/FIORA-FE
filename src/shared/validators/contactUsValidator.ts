import Joi from 'joi';

export const contactUsSchema = Joi.object({
  name: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Name is required',
    'string.max': 'Name must not exceed 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  phoneNumber: Joi.string().min(8).max(20).required().messages({
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Please provide a valid phone number',
    'string.min': 'Phone number must be at least 8 characters',
    'string.max': 'Phone number must not exceed 20 characters',
    'any.required': 'Phone number is required',
  }),
  title: Joi.string().trim().max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title must not exceed 200 characters',
    'any.required': 'Title is required',
  }),
  message: Joi.string().trim().max(2000).required().messages({
    'string.empty': 'Message is required',
    'string.max': 'Message must not exceed 2000 characters',
    'any.required': 'Message is required',
  }),
  attachments: Joi.array().items(Joi.any()).optional().messages({
    'array.base': 'Attachments must be an array',
  }),
});
