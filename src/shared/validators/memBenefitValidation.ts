import Joi from 'joi';

export const membershipBenefitCreateSchema = Joi.object({
  membershipBenefit: Joi.object({
    name: Joi.string().min(1).max(255).required(),
    slug: Joi.string().min(1).max(255).required(),
    description: Joi.string().max(1000).optional().allow(''),
    suffix: Joi.string().min(1).max(255).optional().allow(''),
    userId: Joi.string().uuid().required(),
  }).required(),

  tierBenefit: Joi.object({
    tierId: Joi.string().uuid().required(),
    value: Joi.number().required(),
  }).required(),
});
