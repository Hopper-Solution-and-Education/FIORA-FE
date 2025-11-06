// File: sendingWalletMessage.ts
// Centralized message constants for SendingWalletUseCase.
// This makes it easier to maintain and localize (multi-language support).

export enum SendingWalletMessage {
  // Validation messages
  AMOUNT_EMPTY = 'Amount FX cannot be empty',
  RECEIVER_EMAIL_EMPTY = 'Receiver email cannot be empty',
  AMOUNT_INVALID = 'Amount must be greater than 0',
  SENDER_NOT_FOUND = 'Sender not found',
  SENDER_WALLET_NOT_FOUND = 'Sender wallet not found',
  RECEIVER_NOT_FOUND = 'Receiver not found',
  RECEIVER_WALLET_NOT_FOUND = 'Receiver wallet not found',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  EXCEEDS_ONE_TIME_LIMIT = 'Exceeds one-time limit',
  EXCEEDS_DAILY_LIMIT = 'Exceeds daily limit',
  PRODUCTS_NOT_FOUND = 'Products not found',
  CATEGORY_NOT_FOUND = 'Category not found',
  DESCRIPTION_TOO_LONG = 'Description must not exceed 150 words',
  OTP_EMPTY = 'OTP must not be empty',
  OTP_CREATE_FAILURE = 'OTP creation failed',
  USER_NOT_FOUND = 'User not found',

  // Email and Notification messages
  EMAIL_SEND_FAILURE = 'Failed to send OTP email',
}
