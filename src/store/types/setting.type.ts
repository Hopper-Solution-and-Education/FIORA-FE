'use client';

import { Currency } from '@prisma/client';

export type Language = 'vi' | 'en';

export const keyLocalCurrency = 'currency';
export const keyLanguage = 'language';

export type ExchangeRateType = { [key: string]: number };

export type SettingStateType = {
  language: Language;
  currency: Currency;
  baseCurrency: Currency;
  exchangeRate: ExchangeRateType;
};

export type SetExchangeRateSettingsParams = Pick<SettingStateType, 'baseCurrency' | 'exchangeRate'>;

const initialSettingState: SettingStateType = {
  language: 'vi',
  currency: 'USD',
  baseCurrency: 'USD',
  exchangeRate: {},
};

export { initialSettingState };
