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
