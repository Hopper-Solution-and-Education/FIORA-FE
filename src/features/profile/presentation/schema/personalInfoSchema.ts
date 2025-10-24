import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';
import * as Yup from 'yup';

export const personalInfoSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string()
    .optional()
    .matches(/^$|^[0-9+().\-\s]{8,20}$/i, 'Enter a valid phone number'),
  birthday: Yup.string().optional(),
  address: Yup.string().max(255, 'Address too long').optional(),
  avatarUrl: Yup.string().optional(),
  logoUrl: Yup.string().optional(),
  referrer_code: Yup.string()
    .optional()
    .trim()
    .max(15, 'Referral code must be at most 15 characters'),
});

export const identificationDocumentSchema = Yup.object({
  idNumber: Yup.string()
    .trim()
    .required('Document number is required')
    .min(5, 'Document number must be at least 5 characters'),
  issuedDate: Yup.string().required('Issue date is required'),
  issuedPlace: Yup.string()
    .trim()
    .required('Place of issuance is required')
    .min(2, 'Place of issuance must be at least 2 characters'),
  idAddress: Yup.string()
    .trim()
    .required('Address on document is required')
    .min(5, 'Address must be at least 5 characters'),
  type: Yup.mixed<IdentificationDocumentType>()
    .oneOf(Object.values(IdentificationDocumentType), 'Invalid document type')
    .required('Document type is required'),
  frontImage: Yup.mixed().required('Front document image is required'),
  backImage: Yup.mixed().required('Back document image is required'),
  facePhoto: Yup.mixed().required('Portrait photo is required'),
});

export const taxInformationSchema = Yup.object({
  taxId: Yup.string()
    .trim()
    .required('Tax identification number is required')
    .min(5, 'Tax ID must be at least 5 characters'),
  taxDocument: Yup.mixed().optional(),
});

export const bankAccountSchema = Yup.object({
  accountNumber: Yup.string()
    .trim()
    .required('Bank account number is required')
    .min(5, 'Account number must be at least 5 characters'),
  accountName: Yup.string()
    .trim()
    .required('Account name is required')
    .min(2, 'Account name must be at least 2 characters'),
  bankName: Yup.string()
    .trim()
    .required('Bank name is required')
    .min(2, 'Bank name must be at least 2 characters'),
  SWIFT: Yup.string()
    .trim()
    .required('SWIFT code is required')
    .min(8, 'SWIFT code must be at least 8 characters')
    .max(11, 'SWIFT code must be at most 11 characters'),
  bankStatement: Yup.mixed().optional(),
});

export type PersonalInfo = {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  address?: string;
  avatarUrl?: string;
  logoUrl?: string;
  referrer_code?: string;
};

export type IdentificationDocument = {
  idNumber: string;
  issuedDate: string;
  issuedPlace: string;
  idAddress: string;
  type: IdentificationDocumentType;
  frontImage: File | null;
  backImage: File | null;
  facePhoto: File | null;
  initialFrontImage?: string;
  initialBackImage?: string;
  initialFacePhoto?: string;
};

export type TaxInformation = {
  taxId: string;
  taxDocument?: File | null;
  existingAttachmentUrl?: string;
  existingFileName?: string;
  existingFileType?: string;
  existingFileSize?: number;
};

export type BankAccount = {
  accountNumber: string;
  accountName: string;
  bankName: string;
  SWIFT: string;
  bankStatement?: File | null;
  existingAttachmentUrl?: string;
  existingFileName?: string;
  existingFileType?: string;
  existingFileSize?: number;
};
