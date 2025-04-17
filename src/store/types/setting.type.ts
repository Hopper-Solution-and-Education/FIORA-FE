'use client';

import { Currency } from '@prisma/client';

export type Language = 'vi' | 'en';

export const keyLocalCurrency = 'currency';
export const keyLanguage = 'language';

interface SettingStateType {
  language: Language;
  currency: Currency;
}

const initialSettingState: SettingStateType = {
  language: 'vi',
  currency: 'VND',
};

export { initialSettingState };
export type { SettingStateType };
