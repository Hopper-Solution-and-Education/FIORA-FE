// File: sendingWalletConstants.ts
// All hardcoded string constants used across SendingWalletUseCase

export enum WalletType {
  PAYMENT = 'Payment',
}

export enum CategoryType {
  EXPENSE = 'Expense',
}

export enum OTPType {
  SENDING_FX = 'SENDING_FX',
}

export enum DeepLink {
  WALLET_PAYMENT = '/wallet/payment',
}

export enum Duration {
  OTP_5_MIN = '300', // 5 minutes
}

export enum LocaleFormat {
  DEFAULT = 'en-US',
}
