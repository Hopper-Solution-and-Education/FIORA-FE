'use client';

import { Currency } from '@prisma/client';

export type Language = 'vi' | 'en';

export const keyLocalCurrency = 'currency';
export const keyLanguage = 'language';

export type CurrencyType = {
  [key: string]: {
    rate: number;
    suffix: string;
  };
};

export type CurrencyObjectType = CurrencyType[keyof CurrencyType];

export type SettingStateType = {
  language: Language;
  currency: Currency;
  baseCurrency: Currency;
  exchangeRate: CurrencyType;
  updatedAt: number;
};

export type SetExchangeRateSettingsParams = Pick<SettingStateType, 'baseCurrency' | 'exchangeRate'>;

const initialSettingState: SettingStateType = {
  language: 'vi',
  currency: 'USD',
  baseCurrency: 'USD',
  exchangeRate: {},
  updatedAt: 0,
};

export { initialSettingState };
