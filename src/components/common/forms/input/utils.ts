import { Currency } from '@/shared/types';
import {
  formatFIORACurrency,
  getCurrencySymbol,
  FIORANumberFormat,
} from '@/config/FIORANumberFormat';

/**
 * Formats a number into a currency string based on the currency code.
 * @param value - The numeric value to format
 * @param currency - The currency code (e.g., 'USD', 'VND', 'FX')
 * @returns Formatted currency string or empty string if invalid
 */
export const formatCurrency = (value: number, currency: string): string => {
  if (typeof value !== 'number' || isNaN(value)) return '';
  return formatFIORACurrency(value, currency as Currency);
};

export const formatSuggestionValue = (
  num: number,
  currency: 'VND' | 'USD' | 'FX',
  shouldShortened?: boolean,
): string => {
  const currencySymbol = getCurrencySymbol(currency as Currency);

  if (num >= 1000000 && shouldShortened) {
    const inMillions = num / 1000000;
    // Use FIORANumberFormat for decimal formatting with consistent locale
    const numberFormatter = new FIORANumberFormat(currency as Currency, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    const formatted = numberFormatter.format(inMillions);

    return currency === 'VND'
      ? `${formatted}M ${currencySymbol}`
      : `${currencySymbol} ${formatted}M`;
  }

  return formatFIORACurrency(num, currency as Currency);
};
