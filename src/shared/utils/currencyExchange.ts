import { Currency, Prisma } from '@prisma/client'; // Import Prisma to use Decimal type

type ExchangeRates = Record<Currency, number>;

const EXCHANGE_RATES_TO_USD: ExchangeRates = {
  [Currency.USD]: 1,
  [Currency.VND]: 25000,
};

// Update convertCurrency to handle Prisma.Decimal
export const convertCurrency = (
  amount: number | Prisma.Decimal, // Allow both number and Decimal
  fromCurrency: Currency,
  toCurrency: Currency,
): number => {
  // Convert Decimal to number if necessary
  const amountAsNumber = typeof amount === 'number' ? amount : amount.toNumber();

  if (fromCurrency === toCurrency) return amountAsNumber;

  const amountInUSD =
    fromCurrency === Currency.USD
      ? amountAsNumber
      : amountAsNumber / EXCHANGE_RATES_TO_USD[fromCurrency];

  const convertedAmount =
    toCurrency === Currency.USD ? amountInUSD : amountInUSD * EXCHANGE_RATES_TO_USD[toCurrency];

  return Number(convertedAmount.toFixed(2));
};

export const isValidCurrency = (currency: string): currency is Currency => {
  return Object.values(Currency).includes(currency as Currency);
};
