export interface ExchangeRateUpsertParams {
  fromCurrency: string;
  toCurrency: string;
  fromSymbol: string;
  toSymbol: string;
  fromValue: number;
  toValue: number;
}
