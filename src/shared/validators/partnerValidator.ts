import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

export const partnerBodySchema = Joi.object({
  name: Joi.string().pattern(excludeEmojiPattern).required().max(255).messages({
    'string.empty': 'Partner name is invalid',
    'string.pattern.base': 'Partner name cannot contain emoji icons like 😍',
    'any.required': 'Partner name is required',
  }),
  logo: Joi.string().allow(null).optional().pattern(excludeEmojiPattern).messages({
    'string.empty': 'Partner logo is invalid',
    'string.pattern.base': 'Partner logo cannot contain emoji icons like ��',
  }),
  description: Joi.string().allow(null).pattern(excludeEmojiPattern).optional().messages({
    'string.pattern.base': 'Partner description cannot contain emoji icons like 😍',
  }),
});
