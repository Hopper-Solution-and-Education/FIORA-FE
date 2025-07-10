import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import prisma from '@/config/prisma/prisma';
import { exchangeRateRepository } from '@/features/setting/api/infrastructure/repositories/exchangeRateRepository';
import { Currency, Prisma } from '@prisma/client'; // Import Prisma to use Decimal type
import { FIXED_NUMBER_OF_DECIMALS } from '../constants';

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
      return Number(amountAsNumber * mappingCurrency.toValue.toNumber());
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

    return Number((amountAsNumber * conversionRates[toCurrency]).toFixed(FIXED_NUMBER_OF_DECIMALS));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to convert currency');
  }
}

export const isValidCurrency = (currency: string): currency is Currency => {
  return Object.values(Currency).includes(currency as Currency);
};

/**
 * Format a number to currency string.
 * @param value - The numeric value to format.
 * @param currency - The ISO 4217 currency code (e.g. 'USD', 'VND', 'FX').
 * @returns A formatted currency string.
 */
export function formatCurrency(value: number, currency: Currency): string {
  return formatFIORACurrency(value, currency);
}
