import Joi from 'joi';

const slugNonNumericPattern = /^[a-zA-Z0-9-]+$/;

export const membershipBenefitCreateSchema = Joi.object({
  membershipBenefit: Joi.object({
    name: Joi.string().min(1).max(255).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least {#limit} characters',
      'string.max': 'Name must be at most {#limit} characters',
      'any.required': 'Name is required',
    }),
    slug: Joi.string().min(1).max(255).pattern(slugNonNumericPattern).required().messages({
      'string.empty': 'Slug is required',
      'string.min': 'Slug must be at least {#limit} characters',
      'string.max': 'Slug must be at most {#limit} characters',
      'string.pattern.base': 'Slug may only contain letters, numbers, and hyphens',
      'any.required': 'Slug is required',
    }),
    description: Joi.string().max(1000).optional().allow('').messages({
      'string.max': 'Description must be at most {#limit} characters',
    }),
    suffix: Joi.string().max(255).optional().allow('').messages({
      'string.max': 'Suffix must be at most {#limit} characters',
    }),
    userId: Joi.string().uuid().required().messages({
      'string.guid': 'User ID must be a valid UUID',
      'any.required': 'User ID is required',
    }),
  }).when(Joi.ref('/mode'), {
    is: Joi.valid('delete', 'delete-all'),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  tierBenefit: Joi.object({
    tierId: Joi.string()
      .uuid()
      .messages({
        'string.guid': 'Tier ID must be a valid UUID',
        'any.required': 'Tier ID is required',
      })
      .when(Joi.ref('/mode'), {
        is: Joi.valid('create', 'update'),
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
    value: Joi.number().required().messages({
      'number.base': 'Value must be a number',
      'any.required': 'Value is required',
    }),
  }).when(Joi.ref('/mode'), {
    is: Joi.valid('delete', 'delete-all'),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  mode: Joi.string()
    .valid('create', 'update', 'delete', 'create-all', 'update-all', 'delete-all')
    .required()
    .messages({
      'any.required': 'mode process membership benefit is required',
      'any.only': 'mode process membership benefit is invalid',
    }),
  slug: Joi.string().when(Joi.ref('/mode'), {
    is: Joi.valid('delete', 'delete-all'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  membershipTierId: Joi.string().when(Joi.ref('/mode'), {
    is: Joi.valid('delete'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  membershipBenefitId: Joi.string().when(Joi.ref('/mode'), {
    is: Joi.valid('delete'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
