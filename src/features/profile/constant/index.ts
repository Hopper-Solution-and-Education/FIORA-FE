import { EKYCStatus } from '../domain/entities/models/profile';

export const KYC_TABS = {
  BANK_ACCOUNT: 'bank-account',
  CONTACT_INFORMATION: 'contact-information',
  IDENTIFICATION_DOCUMENT: 'identification-document',
  TAX_INFORMATION: 'tax-information',
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
