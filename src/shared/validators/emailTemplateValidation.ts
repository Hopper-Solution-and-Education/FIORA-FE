import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const emailTemplateSchema = Joi.object({
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
  // type: Joi.string()
  //   .required()
  //   .valid(EmailTemplateType.DEPOPSIT, EmailTemplateType.KYC, EmailTemplateType.MEMBERSHIP)
  //   .messages({
  //     'string.empty': 'Email template type is invalid',
  //     'any.required': 'Email template type is required',
  //     'any.only': 'Email template type is invalid',
  //   }),
});
