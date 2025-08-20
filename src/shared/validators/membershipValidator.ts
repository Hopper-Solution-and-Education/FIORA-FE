import Joi from 'joi';
import { excludeEmojiPattern } from '../constants';

// only allow alphanumeric and hyphens examples: "free-tier"
const slugNonNumericPattern = /^[a-zA-Z0-9-]+$/;

const membershipKeyValSchema = Joi.object({
  slug: Joi.string().pattern(slugNonNumericPattern).required().min(1).max(255).messages({
    'string.empty': 'Membership slug is required',
    'string.min': 'Membership slug must be at least 1 character',
    'string.max': 'Membership slug must be at most 255 characters',
  }),
  value: Joi.number().required().min(0).messages({
    'number.base': 'Membership tier benefit value is required',
    'number.min': 'Membership tier benefit value must be at least 0',
  }),
});

export const membershipTierSchema = Joi.object({
  tierName: Joi.string().optional().allow('').min(1).max(500).messages({
    'string.empty': 'Membership tier name is required',
    'string.min': 'Membership tier name must be at least 1 character',
    'string.max': 'Membership tier name must be at most 500 characters',
  }),
  mainIconUrl: Joi.string().optional().allow('').pattern(excludeEmojiPattern).messages({
    'string.empty': 'Membership tier main icon URL is invalid',
    'string.pattern.base': 'Membership tier main icon URL cannot contain emoji icons like 😍',
  }),
  passedIconUrl: Joi.string().optional().allow('').pattern(excludeEmojiPattern).messages({
    'string.empty': 'Membership tier passed icon URL is invalid',
    'string.pattern.base': 'Membership tier passed icon URL cannot contain emoji icons like 😍',
  }),
  inactiveIconUrl: Joi.string().optional().allow('').pattern(excludeEmojiPattern).messages({
    'string.empty': 'Membership tier inactive icon URL is invalid',
    'string.pattern.base': 'Membership tier inactive icon URL cannot contain emoji icons like 😍',
  }),
  themeIconUrl: Joi.string().optional().allow('').pattern(excludeEmojiPattern).messages({
    'string.empty': 'Membership tier theme icon URL is invalid',
    'string.pattern.base': 'Membership tier theme icon URL cannot contain emoji icons like 😍',
  }),
  story: Joi.string().optional().allow('').max(10000).messages({
    'string.empty': 'Membership tier story is invalid',
    'string.max': 'Membership tier story must be at most 10000 characters',
  }),
  tierBenefits: Joi.array().items(membershipKeyValSchema).required().min(1).max(10).messages({
    'array.base': 'Membership tier key value is required',
    'array.min': 'Membership tier key value must be at least 1',
    'array.max': 'Membership tier key value must be at most 10',
  }),
});

export const updateMembershipTierThresholdSchema = Joi.object({
  axis: Joi.string().valid('spent', 'balance').required().messages({
    'string.base': 'Axis is required',
    'any.only': 'Axis must be either "spent" or "balance"',
  }),
  oldMin: Joi.number().min(0).required().messages({
    'number.base': 'Old minimum threshold is required',
    'number.min': 'Old minimum threshold must be at least 0',
  }),
  oldMax: Joi.number().min(0).required().messages({
    'number.base': 'Old maximum threshold is required',
    'number.min': 'Old maximum threshold must be at least 0',
  }),
  newMin: Joi.number().min(0).optional().messages({
    'number.base': 'New minimum threshold must be a number',
    'number.min': 'New minimum threshold must be at least 0',
  }),
  newMax: Joi.number().min(0).optional().messages({
    'number.base': 'New maximum threshold must be a number',
    'number.min': 'New maximum threshold must be at least 0',
  }),
})
  .custom((value, helpers) => {
    // Validate that oldMin < oldMax
    if (value.oldMin >= value.oldMax) {
      return helpers.error('custom.oldMinMax', {
        message: 'Old minimum must be less than old maximum',
      });
    }

    // Validate that newMin < newMax (if both provided)
    if (value.newMin !== undefined && value.newMax !== undefined && value.newMin >= value.newMax) {
      return helpers.error('custom.newMinMax', {
        message: 'New minimum must be less than new maximum',
      });
    }

    // At least one of newMin or newMax must be provided
    if (value.newMin === undefined && value.newMax === undefined) {
      return helpers.error('custom.noNewValues', {
        message: 'At least one of newMin or newMax must be provided',
      });
    }

    return value;
  })
  .messages({
    'custom.oldMinMax': 'Old minimum must be less than old maximum',
    'custom.newMinMax': 'New minimum must be less than new maximum',
    'custom.noNewValues': 'At least one of newMin or newMax must be provided',
  });
