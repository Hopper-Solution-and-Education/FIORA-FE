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
  currency_suffix: { [key: string]: string };
};

export type CurrencyFormatterOptions = {
  shouldShortened?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  applyExchangeRate?: boolean;
};

export type ExchangeAmountParams = {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
};

export type ExchangeAmountResult = {
  convertedAmount: number;
  originalAmount: number;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  formattedAmount: string;
};
