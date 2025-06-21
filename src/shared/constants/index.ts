export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const USD_VND_RATE = 25000;
export const FIREBASE_STORAGE_URL = 'https://firebasestorage.googleapis.com';
export const FIREBASE_GS_URL = 'gs://';

export const MODULE = {
  HOME: 'HOME',
  WALLET: 'WALLET',
  ACCOUNT: 'ACCOUNT',
  CATEGORY: 'CATEGORY',
  TRANSACTION: 'TRANSACTION',
  BUDGET: 'BUDGET',
  ADMIN: 'ADMIN',
} as const;

export const CURRENCY = {
  USD: 'USD',
  VND: 'VND',
} as const;

export const excludeEmojiPattern =
  /^[^\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u;
