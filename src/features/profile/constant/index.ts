import { EKYCStatus, EKYCType } from '../domain/entities/models/profile';
import { KYCPageType } from '../presentation/modules/eKyc/types';
import BankAccountVerifyForm from '../presentation/modules/eKyc/verify/BankAccountVerifyForm';
import ContactInformationVerifyForm from '../presentation/modules/eKyc/verify/ContactInformationVerifyForm';
import IdentificationDocumentVerifyForm from '../presentation/modules/eKyc/verify/IdentificationDocumentVerifyForm';
import TaxInformationVerifyForm from '../presentation/modules/eKyc/verify/TaxInformationVerifyForm';

export const KYC_ITEMS = {
  IDENTIFICATION_DOCUMENT: {
    type: EKYCType.IDENTIFICATION_DOCUMENT,
    label: 'Identification Document',
    route: 'identification-document',
  },
  CONTACT_INFORMATION: {
    type: EKYCType.CONTACT_INFORMATION,
    label: 'Contact Information',
    route: 'contact-information',
  },
  TAX_INFORMATION: {
    type: EKYCType.TAX_INFORMATION,
    label: 'Tax Information',
    route: 'tax-information',
  },
  BANK_ACCOUNT: {
    type: EKYCType.BANK_ACCOUNT,
    label: 'Bank Accounts',
    route: 'bank-account',
  },
};

export const STATUS_COLOR = {
  [EKYCStatus.APPROVAL]: {
    color: 'bg-green-300',
    textColor: 'text-green-700',
    borderColor: 'border-green-300',
    hoverColor: 'hover:bg-green-400',
    iconColor: 'text-green-700',
  },
  [EKYCStatus.PENDING]: {
    color: 'bg-yellow-300',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-300',
    borderColor: 'border-yellow-300',
    hoverColor: 'hover:bg-yellow-400',
  },
  [EKYCStatus.REJECTED]: {
    color: 'bg-red-100',
    textColor: 'text-red-700',
    iconColor: 'text-red-700',
    borderColor: 'border-red-300',
    hoverColor: 'hover:bg-red-400',
  },
};

// KYC Verify Page Constants
export const KYC_TAB_CONFIG = [
  {
    id: KYCPageType.identificationDocument,
    label: 'Identification Document',
    component: IdentificationDocumentVerifyForm,
  },
  {
    id: KYCPageType.contactInformation,
    label: 'Contact Information',
    component: ContactInformationVerifyForm,
  },
  {
    id: KYCPageType.taxInformation,
    label: 'Tax Information',
    component: TaxInformationVerifyForm,
  },
  {
    id: KYCPageType.bankAccount,
    label: 'Bank Accounts',
    component: BankAccountVerifyForm,
  },
] as const;

export const MODAL_CONFIG = {
  approve: {
    title: 'Approve KYC Request',
    description:
      'This action will mark the KYC status as "Approved", and the user will be considered verified. Please ensure all submitted information and documents have been carefully reviewed.',
    variant: 'info' as const,
    type: 'info' as const,
    confirmText: 'Continue',
  },
  reject: {
    title: 'Reject KYC Request',
    description:
      'This action will mark the KYC status as "Rejected". The user will be notified and may be required to re-submit their documents.',
    variant: 'danger' as const,
    type: 'danger' as const,
    confirmText: 'Continue',
  },
} as const;

export const OTP_MODAL_CONFIG = {
  description: 'Please verify this action using the OTP sent to your email',
  variant: 'info' as const,
  type: 'info' as const,
  confirmText: 'Verify',
  cancelText: 'Cancel',
} as const;
