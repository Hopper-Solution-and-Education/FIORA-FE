import { UserRole } from '@/shared/constants/userRole';

export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  logoUrl: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
  role?: UserRole;
  eKYC?: eKYC[];
};

export type eKYC = {
  id: string;
  type: EKYCType;
  fieldName: string;
  status: EKYCStatus;
  createdBy: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileRequest = Partial<Omit<UserProfile, 'id' | 'email'>> & {
  // Restrict updatable fields; email/id immutable here
  name?: string | null;
  avatarUrl?: string | null;
  logoUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  birthday?: string | null;
  newAvatar?: File | null;
  newLogo?: File | null;
};

export enum EKYCStatus {
  PENDING = 'PENDING',
  APPROVAL = 'APPROVAL',
  REJECTED = 'REJECTED',
}

export enum EKYCType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CONTACT_INFORMATION = 'CONTACT',
  IDENTIFICATION_DOCUMENT = 'IDENTIFICATION',
  TAX_INFORMATION = 'TAX',
}

// Identification Document Types
export enum IdentificationDocumentType {
  PASSPORT = 'PASSPORT',
  NATIONAL = 'NATIONAL',
  BUSINESS = 'BUSINESS',
  TAX = 'TAX',
}

export interface IdentificationDocumentFormData {
  idNumber: string;
  issuedDate: string;
  issuedPlace: string;
  idAddress: string;
  type: IdentificationDocumentType;
}

export interface IdentificationDocumentPayload {
  fileFrontId?: string;
  fileBackId?: string;
  idAddress?: string;
  issuedDate?: string;
  type: IdentificationDocumentType;
  idNumber: string;
  filePhotoId?: string;
  issuedPlace?: string;
}

export interface BankAccountFormData {
  accountNumber: string;
  accountName: string;
  bankName: string;
  SWIFT: string;
}
