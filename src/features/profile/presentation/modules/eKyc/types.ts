export const KYCPageType = {
  bankAccount: 'bank-account',
  contactInformation: 'contact-information',
  identificationDocument: 'identification-document',
  taxInformation: 'tax-information',
};

export type OtpModalState = {
  isOpen: boolean;
  type: 'email' | 'phone' | null;
  otpValue: string;
  countdown: number;
  email: string;
  phone: string;
};

export const OTP_COUNTDOWN_TIME = 120;
