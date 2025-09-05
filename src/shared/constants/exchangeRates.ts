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

export const EXCHANGE_RATE_STALE_TIME = 6 * 60 * 60 * 1000;
export const CACHE_KEY = 'fiora_exchange_rates';
