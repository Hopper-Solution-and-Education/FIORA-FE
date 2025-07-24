import {
  FIORANumberFormat,
  formatFIORACurrency,
  getCurrencySymbol,
} from '@/config/FIORANumberFormat';
import { Currency } from '@/shared/types';

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

  // Limit max suggestion value to 10_000_000_000, preserve sign
  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(num);
  const cappedNum = Math.min(absNum, 10_000_000_000);

  if (shouldShortened) {
    let formatted = '';
    let suffix = '';
    let value = cappedNum;
    if (cappedNum >= 1_000_000_000) {
      value = cappedNum / 1_000_000_000;
      suffix = 'B';
    } else if (cappedNum >= 1_000_000) {
      value = cappedNum / 1_000_000;
      suffix = 'M';
    } else if (cappedNum >= 1_000) {
      value = cappedNum / 1_000;
      suffix = 'K';
    }
    if (suffix) {
      // Use FIORANumberFormat for decimal formatting with consistent locale
      const numberFormatter = new FIORANumberFormat(currency as Currency, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
      formatted = numberFormatter.format(value);
      return currency === 'VND'
        ? `${sign}${formatted}${suffix} ${currencySymbol}`
        : `${sign}${currencySymbol} ${formatted}${suffix}`;
    }
  }

  // For non-shortened, use formatFIORACurrency and add sign if needed
  const formattedCurrency = formatFIORACurrency(cappedNum, currency as Currency);
  return sign ? `-${formattedCurrency}` : formattedCurrency;
};
