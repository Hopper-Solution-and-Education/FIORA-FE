import { IdentificationStatus, IdentificationType } from '@prisma/client';
import Joi from 'joi';

const baseSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IdentificationType))
    .required()
    .messages({
      'any.required': 'Document type is required',
      'any.only': 'Document type must be NATIONAL_CARD, PASSPORT or BUSINESS_LICENSE',
    }),

  idNumber: Joi.string().max(100).required().messages({
    'string.empty': 'ID number is required',
    'string.max': 'ID number must be at most 100 characters',
    'any.required': 'ID number is required',
  }),

  issuedDate: Joi.date().required().messages({
    'date.base': 'Issued date must be a valid date',
    'any.required': 'Issued date is required',
  }),

  issuedPlace: Joi.string().max(255).required().messages({
    'string.empty': 'Place of issuance is required',
    'string.max': 'Place of issuance must be at most 255 characters',
    'any.required': 'Place of issuance is required',
  }),

  idAddress: Joi.string().max(255).required().messages({
    'string.empty': 'Address is required',
    'string.max': 'Address must be at most 255 characters',
    'any.required': 'Address is required',
  }),

  remarks: Joi.string().allow('', null).optional(),

  fileFrontId: Joi.string().uuid().optional().allow(null),
  fileBackId: Joi.string().uuid().optional().allow(null),
  filePhotoId: Joi.string().uuid().optional().allow(null),
  fileLocationId: Joi.string().uuid().optional().allow(null),

  status: Joi.string()
    .valid(...Object.values(IdentificationStatus))
    .default(IdentificationStatus.pending),
});

export const identificationDocumentSchema = baseSchema
  .when(Joi.object({ type: IdentificationType.national }).unknown(), {
    then: Joi.object({
      fileFrontId: Joi.string().uuid().required().messages({
        'any.required': 'Front side of ID card is required',
      }),
      fileBackId: Joi.string().uuid().required().messages({
        'any.required': 'Back side of ID card is required',
      }),
      filePhotoId: Joi.string().uuid().required().messages({
        'any.required': 'Portrait photo is required',
      }),
    }),
  })
  .when(Joi.object({ type: IdentificationType.passport }).unknown(), {
    then: Joi.object({
      fileFrontId: Joi.string().uuid().required().messages({
        'any.required': 'Passport information page is required',
      }),
      filePhotoId: Joi.string().uuid().required().messages({
        'any.required': 'Portrait photo is required',
      }),
    }),
  })
  .when(Joi.object({ type: IdentificationType.business }).unknown(), {
    then: Joi.object({
      fileFrontId: Joi.string().uuid().required().messages({
        'any.required': 'Front side of business license is required',
      }),
      fileBackId: Joi.string().uuid().required().messages({
        'any.required': 'Back side of business license is required',
      }),
      fileLocationId: Joi.string().uuid().required().messages({
        'any.required': 'At least one office address photo is required',
      }),
    }),
  });
