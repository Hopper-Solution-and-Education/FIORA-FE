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

export const newsIdSchema = Joi.string().uuid().required().messages({
  'string.empty': 'News is required',
  'any.required': 'News is required',
  'string.uuid': 'News must be a valid UUID format',
});

export const newsCreateRequestSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.empty': 'NewsId is required',
    'any.required': 'NewsId is required',
    'string.uuid': 'User ID must be a valid UUID format',
  }),
  // userId: Joi.string().uuid().required().messages({
  //   'string.empty': 'UserId is required',
  //   'any.required': 'UserId is required',
  //   'string.uuid': 'User ID must be a valid UUID format',
  // }),
});

//comment
export const commetCreateRequestSchema = Joi.object({
  newsId: Joi.string().uuid().required().messages({
    'string.empty': 'NewsId is required',
    'any.required': 'NewsId is required',
    'string.uuid': 'User ID must be a valid UUID format',
  }),
  userId: Joi.string().uuid().required().messages({
    'string.empty': 'UserId is required',
    'any.required': 'UserId is required',
    'string.uuid': 'User ID must be a valid UUID format',
  }),
});

export const commetUpdateRequestSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.empty': 'UserId is required',
    'any.required': 'UserId is required',
    'string.uuid': 'User ID must be a valid UUID format',
  }),
  content: Joi.string().required().messages({
    'string.empty': 'commentId is required',
    'any.required': 'commentId is required',
  }),
});

export const commentIdSchema = Joi.string().uuid().required().messages({
  'string.empty': 'CommentId is required',
  'any.required': 'CommentId is required',
  'string.uuid': 'CommentId must be a valid UUID format',
});
