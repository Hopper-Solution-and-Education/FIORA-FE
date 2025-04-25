export const exchangeRates = {
  VND: {
    USD: 0.00003862,
    VND: 1,
  },
  USD: {
    VND: 25892.6792,
    USD: 1,
  },
};

export type ExchangeRate = keyof typeof exchangeRates;
export type ExchangeRateValue = keyof (typeof exchangeRates)[ExchangeRate];
export type ExchangeRateObject = (typeof exchangeRates)[ExchangeRate];
