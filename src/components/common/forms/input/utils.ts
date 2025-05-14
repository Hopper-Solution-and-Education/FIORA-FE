/**
 * Formats a number into a currency string based on the currency code.
 * @param value - The numeric value to format
 * @param currency - The currency code (e.g., 'USD', 'VND')
 * @returns Formatted currency string or empty string if invalid
 */
export const formatCurrency = (value: number, currency: string): string => {
  if (typeof value !== 'number' || isNaN(value)) return '';
  return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
    style: 'currency',
    currency,
    // For VND, typically no decimals; for USD, 2 decimals
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2,
  }).format(value);
};

export const formatSuggestionValue = (
  num: number,
  currency: 'VND' | 'USD',
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
