export type ExchangeRateType = {
  id: string;
  fromValue: number;
  toValue: number;
  authorId: string;
  fromCurrencyId: string;
  toCurrencyId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string;
  fromCurrency: string;
  toCurrency: string;
  fromSymbol: string;
  toSymbol: string;
};

export type ExchangeRateObjectType = Pick<
  ExchangeRateType,
  'fromValue' | 'toValue' | 'fromCurrency' | 'toCurrency' | 'fromSymbol' | 'toSymbol'
>;

export type ExchangeRateDeleteType = Pick<ExchangeRateType, 'fromCurrencyId' | 'toCurrencyId'>;
