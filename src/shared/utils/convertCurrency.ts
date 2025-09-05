import prisma from '@/config/prisma/prisma';
import { exchangeRateRepository } from '@/features/setting/api/infrastructure/repositories/exchangeRateRepository';
import { Currency, Prisma } from '@prisma/client'; // Import Prisma to use Decimal type

// Update convertCurrency to handle Prisma.Decimal
export async function convertCurrency(
  amount: number | Prisma.Decimal,
  fromCurrency: string,
  toCurrency: string,
): Promise<number> {
  try {
    const amountAsNumber = typeof amount === 'number' ? amount : amount.toNumber();

    if (fromCurrency === toCurrency) {
      return amountAsNumber;
    }
    // Validate currencies
    const mappingCurrency = await prisma.exchangeRateSetting.findFirst({
      where: {
        FromCurrency: {
          name: fromCurrency,
        },
        ToCurrency: {
          name: toCurrency,
        },
      },
      select: {
        fromValue: true,
        toValue: true,
      },
    });

    if (mappingCurrency) {
      // Use proper rounding to prevent precision loss
      const result = amountAsNumber * mappingCurrency.toValue.toNumber();
      return Math.round(result * 100) / 100; // Round to 2 decimal places
    }

    const [fromCurrencyData, toCurrencyData] = await Promise.all([
      prisma.currencyExchange.findFirst({
        where: { name: fromCurrency },
      }),
      prisma.currencyExchange.findFirst({
        where: { name: toCurrency },
      }),
    ]);

    if (!fromCurrencyData || !toCurrencyData) {
      throw new Error(`Invalid currency: ${!fromCurrencyData ? fromCurrency : toCurrency}`);
    }

    const response = await exchangeRateRepository.populateRateCache(fromCurrency);
    const conversionRates = response.conversion_rates;

    const result = amountAsNumber * conversionRates[toCurrency];
    return Math.round(result * 100) / 100;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to convert currency');
  }
}

export const isValidCurrency = (currency: string): currency is Currency => {
  return Object.values(Currency).includes(currency as Currency);
};
