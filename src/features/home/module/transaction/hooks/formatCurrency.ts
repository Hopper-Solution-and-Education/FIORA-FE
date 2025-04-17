import { TransactionCurrency } from '../utils/constants';

export const formatCurrency = (
  num: number,
  currency: TransactionCurrency,
  shouldShortened?: boolean,
): string => {
  const locale = currency === 'VND' ? 'vi-VN' : 'en-US';
  const currencySymbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
    .format(0)
    .replace(/[\d\s,.]/g, '');

  if (num >= 1000000 && shouldShortened) {
    const inMillions = num / 1000000;
    const formatted = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(inMillions);

    return currency === 'VND'
      ? `${formatted}M ${currencySymbol}`
      : `${currencySymbol} ${formatted}M`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(num);
};
