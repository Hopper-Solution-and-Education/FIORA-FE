import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const createEmailTemplateDto = Joi.object({
  name: Joi.string().pattern(excludeEmojiPattern).required().max(255).messages({
    'string.empty': 'Email template name is invalid',
    'string.pattern.base': 'Email template name is invalid',
    'any.required': 'Email template name is required',
  }),
  content: Joi.string().pattern(excludeEmojiPattern).required().messages({
    'string.empty': 'Content is invalid',
    'string.pattern.base': 'Content template name is invalid',
    'any.required': 'Content template name is required',
  }),
  type: Joi.string()
    .guid({ version: ['uuidv4', 'uuidv5'] }) // kiểm tra định dạng UUID
    .required()
    .messages({
      'string.empty': 'Email template type is invalid',
      'string.guid': 'Email template type must be a valid UUID',
      'any.required': 'Email template type is required',
    }),
});

export const editEmailTemplateDto = Joi.object({
  name: Joi.string().pattern(excludeEmojiPattern).required().max(255).messages({
    'string.empty': 'Email template name is invalid',
    'string.pattern.base': 'Email template name is invalid',
    'any.required': 'Email template name is required',
  }),
  content: Joi.string().pattern(excludeEmojiPattern).required().messages({
    'string.empty': 'Content is invalid',
    'string.pattern.base': 'Content template name is invalid',
    'any.required': 'Content template name is required',
  }),

  isActive: Joi.boolean().required().messages({
    'boolean.base': 'isActive must be true or false',
    'any.required': 'isActive is required',
  }),
});
