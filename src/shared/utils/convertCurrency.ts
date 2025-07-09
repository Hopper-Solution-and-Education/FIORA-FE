import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import prisma from '@/config/prisma/prisma';
import { exchangeRateRepository } from '@/features/setting/api/infrastructure/repositories/exchangeRateRepository';
import { FIXED_NUMBER_OF_DECIMALS } from '@/shared/constants';
import { Currency } from '@prisma/client'; // Import Prisma to use Decimal type

// Update convertCurrency to handle Prisma.Decimal
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<number> {
  try {
    // Validate currencies
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

    // Cache is stale or missing rate, repopulate
    const response = await exchangeRateRepository.populateRateCache(fromCurrency);
    const conversionRates = response.conversion_rates;

    if (conversionRates[toCurrency] === undefined) {
      throw new Error(`No conversion rate available for ${fromCurrency} to ${toCurrency}`);
    }

    return Number((amount * conversionRates[toCurrency]).toFixed(FIXED_NUMBER_OF_DECIMALS));
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
