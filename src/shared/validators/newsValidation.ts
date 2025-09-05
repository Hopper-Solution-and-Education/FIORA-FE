import Joi from 'joi';

export const createNewsSchema = Joi.object({
  title: Joi.string().required().max(255).messages({
    'any.required': 'Title is required',
    'string.empty': 'Title is required',
    'string.max': 'Title must be at most 255 characters',
  }),
  description: Joi.string().max(255).messages({
    'string.empty': 'Description is required',
    'string.max': 'Description must be at most 255 characters',
  }),
  type: Joi.string().required().messages({
    'string.empty': 'Type is required',
    'any.required': 'Type is required',
    'string.max': 'Type must be at most 255 characters',
  }),
  userId: Joi.string().uuid().required().messages({
    'string.empty': 'Type is required',
    'any.required': 'Type is required',
    'string.max': 'Type must be at most 255 characters',
    'string.uuid': 'User ID must be a valid UUID format',
  }),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Type is required',
    'any.required': 'Type is required',
  }),
});

export const updateNewsSchema = Joi.object({
  title: Joi.string().required().max(255).messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required',
    'string.max': 'Title must be at most 255 characters',
  }),
  description: Joi.string().max(255).messages({
    'string.empty': 'Description is required',
    'string.max': 'Description must be at most 255 characters',
  }),
  type: Joi.string().required().messages({
    'string.empty': 'Type is required',
    'any.required': 'Type is required',
    'string.max': 'Type must be at most 255 characters',
  }),
  categoryId: Joi.string().required().messages({
    'string.empty': 'Type is required',
    'any.required': 'Type is required',
  }),
  userId: Joi.string().uuid().required().messages({
    'string.empty': 'UserId is required',
    'any.required': 'UserId is required',
    'string.uuid': 'User ID must be a valid UUID format',
  }),
});

export const postIdSchema = Joi.string().uuid().required().messages({
  'string.empty': 'PostId is required',
  'any.required': 'PostId is required',
  'string.uuid': 'PostId must be a valid UUID format',
});
