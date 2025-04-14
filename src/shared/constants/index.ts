export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
export const USD_VND_RATE = 25000;
export const FIREBASE_STORAGE_URL = 'https://firebasestorage.googleapis.com';
export const FIREBASE_GS_URL = 'gs://';

export const MODULE = {
  HOME: 'HOME',
  ACCOUNT: 'ACCOUNT',
  CATEGORY: 'CATEGORY',
  TRANSACTION: 'TRANSACTION',
  BUDGET: 'BUDGET',
  ADMIN: 'ADMIN',
} as const;
