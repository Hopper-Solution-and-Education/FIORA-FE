import { TransactionCurrency } from '../utils/constants';
import {
  formatFIORACurrency,
  getCurrencySymbol,
  FIORANumberFormat,
} from '@/config/FIORANumberFormat';
import { Currency } from '@/shared/types';

export const formatCurrency = (
  num: number,
  currency: TransactionCurrency,
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
