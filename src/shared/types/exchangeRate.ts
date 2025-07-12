import { Currency } from '@prisma/client';

export type ExchangeRateUpsertParams = {
  fromCurrency: string;
  toCurrency: string;
  fromSymbol: string;
  toSymbol: string;
  fromValue: number;
  toValue: number;
};

export type ExchangeRateResponse = {
  time_last_update_unix: number;
  time_last_update_utc: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
};

export type CurrencyFormatterOptions = {
  shouldShortened?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export type ExchangeAmountParams = {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
};

export type ExchangeAmountResult = {
  convertedAmount: number;
  originalAmount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  exchangeRate: number;
  formattedAmount: string;
};
