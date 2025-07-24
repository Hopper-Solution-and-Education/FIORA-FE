import Joi from 'joi';

export const faqCreateSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
  }),
  description: Joi.string().optional(),
  content: Joi.string().required().messages({
    'string.empty': 'Content is required',
    'any.required': 'Content is required',
  }),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Category ID is required',
    'any.required': 'Category ID is required',
  }),
});
