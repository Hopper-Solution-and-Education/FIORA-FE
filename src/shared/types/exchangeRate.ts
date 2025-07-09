export interface ExchangeRateUpsertParams {
  fromCurrency: string;
  toCurrency: string;
  fromSymbol: string;
  toSymbol: string;
  fromValue: number;
  toValue: number;
}

export interface ExchangeRateResponse {
  time_last_update_unix: number;
  time_last_update_utc: string;
  base_code: string;
  conversion_rates: { [key: string]: number };
}