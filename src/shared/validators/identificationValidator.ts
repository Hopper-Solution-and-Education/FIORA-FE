import { IdentificationType, KYCStatus } from '@prisma/client';
import Joi from 'joi';

const baseSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IdentificationType))
    .required()
    .messages({
      'any.required': 'Document type is required',
      'any.only': 'Document type must be NATIONAL, PASSPORT, BUSINESS, TAX',
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
    .valid(...Object.values(KYCStatus))
    .default(KYCStatus.PENDING),
});

export const identificationDocumentSchema = baseSchema
  .when(Joi.object({ type: IdentificationType.NATIONAL }).unknown(), {
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
  .when(Joi.object({ type: IdentificationType.PASSPORT }).unknown(), {
    then: Joi.object({
      fileFrontId: Joi.string().uuid().required().messages({
        'any.required': 'Passport information page is required',
      }),
      filePhotoId: Joi.string().uuid().required().messages({
        'any.required': 'Portrait photo is required',
      }),
    }),
  })
  .when(Joi.object({ type: IdentificationType.BUSINESS }).unknown(), {
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
  })
  .when(Joi.object({ type: IdentificationType.TAX }).unknown(), {
    then: Joi.object({
      idNumber: Joi.string().max(100).required().messages({
        'string.empty': 'ID number is required',
        'string.max': 'ID number must be at most 100 characters',
        'any.required': 'ID number is required',
      }),
      filePhotoId: Joi.string().uuid().required().messages({
        'any.required': 'Portrait photo is required',
      }),
      // For TAX identification, other fields are not needed
      issuedDate: Joi.any().optional().strip(),
      issuedPlace: Joi.any().optional().strip(),
      idAddress: Joi.any().optional().strip(),
      fileFrontId: Joi.any().optional().strip(),
      fileBackId: Joi.any().optional().strip(),
      fileLocationId: Joi.any().optional().strip(),
    }),
  });

export const editIdentificationSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(KYCStatus))
    .required()
    .messages({
      'any.required': 'status is required',
      'any.only': 'status must be PENDING, APPROVAL, REJECTED',
    }),

  remarks: Joi.string().optional().messages({}),

  kycId: Joi.string().uuid().required().messages({
    'string.guid': 'refId must be a valid UUID',
    'string.empty': 'Address is required',
  }),
});
