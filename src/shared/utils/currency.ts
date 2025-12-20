// Currency formatting utilities
// Provides consistent currency formatting and validation across the application

import { prisma } from '@/config';
import { exchangeRateRepository } from '@/features/setting/api/infrastructure/repositories/exchangeRateRepository';
import { Currency, Prisma } from '@prisma/client';

// Constants for currency formatting
export const CURRENCY_CONSTANTS = {
  MAX_DIGITS: 13,
  MAX_DECIMAL_DIGITS: 2,
  DEFAULT_LOCALE: 'vi-VN',
  DEFAULT_CURRENCY: 'VND',
} as const;

// Enum for rounding modes
export enum RoundingMode {
  UP = 'up', // Always round up (Math.ceil)
  DOWN = 'down', // Always round down (Math.floor)
  NORMAL = 'normal', // Standard rounding (Math.round)
}

// Type for currency format options
export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  roundingMode?: RoundingMode;
  showCurrencySymbol?: boolean;
}

/**
 * Apply rounding based on specified mode
 * @param num - Number to round
 * @param roundingMode - Rounding mode to apply
 * @returns Rounded number with max 2 decimal places
 */
export const applyRounding = (
  num: number,
  roundingMode: RoundingMode = RoundingMode.NORMAL,
): number => {
  // Use multiplication to avoid floating point precision issues
  const multiplied = num * 100;

  switch (roundingMode) {
    case RoundingMode.UP:
      return Math.ceil(multiplied) / 100;
    case RoundingMode.DOWN:
      return Math.floor(multiplied) / 100;
    case RoundingMode.NORMAL:
    default:
      return Math.round(multiplied) / 100;
  }
};

/**
 * Format number as currency string with proper rounding
 * @param num - Number to format
 * @param roundingMode - Rounding mode to apply
 * @returns Formatted currency string
 */
export const formatCurrencyNumber = (
  num: number,
  roundingMode: RoundingMode = RoundingMode.NORMAL,
): string => {
  const roundedNumber = applyRounding(num, roundingMode);
  return parseFloat(roundedNumber.toFixed(CURRENCY_CONSTANTS.MAX_DECIMAL_DIGITS)).toString();
};

/**
 * Validate currency input string
 * @param value - Input string to validate
 * @param allowNegative - Whether to allow negative numbers
 * @returns Object with validation result and formatted value
 */
export const validateCurrencyInput = (
  value: string,
  allowNegative: boolean = false,
): { isValid: boolean; formatted: string } => {
  // Remove all non-numeric characters except decimal point and minus sign (if allowed)
  const allowedChars = allowNegative ? /[^\d.-]/g : /[^\d.]/g;
  let cleanValue = value.replace(allowedChars, '');

  // Handle negative sign - only allow at the beginning
  let isNegative = false;
  if (allowNegative && cleanValue.includes('-')) {
    isNegative = cleanValue.startsWith('-');
    cleanValue = cleanValue.replace(/-/g, ''); // Remove all minus signs
  }

  // Handle multiple decimal points - keep only the first one
  const decimalParts = cleanValue.split('.');
  if (decimalParts.length > 2) {
    cleanValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
  }

  // Split into integer and decimal parts
  const [integerPart = '', decimalPart = ''] = cleanValue.split('.');

  // Validate constraints
  const isValidInteger = integerPart.length <= CURRENCY_CONSTANTS.MAX_DIGITS;
  const isValidDecimal = decimalPart.length <= CURRENCY_CONSTANTS.MAX_DECIMAL_DIGITS;

  if (!isValidInteger || !isValidDecimal) {
    return { isValid: false, formatted: '' };
  }

  // Format the value
  let formattedValue = integerPart;

  // Handle decimal part
  if (cleanValue.includes('.') || decimalPart.length > 0) {
    const validDecimalPart = decimalPart.length > 2 ? decimalPart.substring(0, 2) : decimalPart;
    formattedValue += '.' + validDecimalPart;
  }

  // Handle leading zeros
  if (integerPart.length > 1 && integerPart.startsWith('0')) {
    const trimmedInteger = integerPart.replace(/^0+/, '');
    formattedValue =
      (trimmedInteger || '0') +
      (formattedValue.includes('.') ? formattedValue.substring(integerPart.length) : '');
  }

  // Add negative sign if needed
  if (isNegative && formattedValue !== '' && formattedValue !== '0') {
    formattedValue = '-' + formattedValue;
  }

  return { isValid: true, formatted: formattedValue };
};

/**
 * Format currency with locale-specific formatting
 * @param amount - Amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export const formatCurrencyWithLocale = (
  amount: number,
  options: CurrencyFormatOptions = {},
): string => {
  const {
    locale = CURRENCY_CONSTANTS.DEFAULT_LOCALE,
    currency = CURRENCY_CONSTANTS.DEFAULT_CURRENCY,
    minimumFractionDigits = 0,
    maximumFractionDigits = CURRENCY_CONSTANTS.MAX_DECIMAL_DIGITS,
    roundingMode = RoundingMode.NORMAL,
    showCurrencySymbol = true,
  } = options;

  // Apply rounding first
  const roundedAmount = applyRounding(amount, roundingMode);

  // Format with Intl.NumberFormat
  const formatter = new Intl.NumberFormat(locale, {
    style: showCurrencySymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(roundedAmount);
};

/**
 * Parse currency string to number
 * @param currencyString - Currency string to parse
 * @param roundingMode - Rounding mode to apply
 * @returns Parsed number
 */
export const parseCurrencyString = (
  currencyString: string,
  roundingMode: RoundingMode = RoundingMode.NORMAL,
): number => {
  // Remove currency symbols and non-numeric characters except decimal point
  const cleanString = currencyString.replace(/[^\d.-]/g, '');
  const parsedValue = parseFloat(cleanString);

  if (isNaN(parsedValue)) {
    return 0;
  }

  return applyRounding(parsedValue, roundingMode);
};

/**
 * Check if amount is within valid currency range
 * @param amount - Amount to check
 * @param allowNegative - Whether negative numbers are allowed
 * @returns True if valid, false otherwise
 */
export const isValidCurrencyAmount = (amount: number, allowNegative: boolean = false): boolean => {
  // Check if amount is within JavaScript's safe integer range
  if (amount > Number.MAX_SAFE_INTEGER || amount < Number.MIN_SAFE_INTEGER) {
    return false;
  }

  // Check for negative numbers if not allowed
  if (!allowNegative && amount < 0) {
    return false;
  }

  // Check if amount has more than max allowed digits
  const amountString = Math.floor(Math.abs(amount)).toString();
  if (amountString.length > CURRENCY_CONSTANTS.MAX_DIGITS) {
    return false;
  }

  return true;
};

/**
 * Convert currency amount between different currencies
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency
 * @param toCurrency - Target currency
 * @param exchangeRate - Exchange rate
 * @param roundingMode - Rounding mode for result
 * @returns Converted amount
 */
export const convertCurrencyAmount = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate: number,
  roundingMode: RoundingMode = RoundingMode.NORMAL,
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const convertedAmount = amount * exchangeRate;
  return applyRounding(convertedAmount, roundingMode);
};

/**
 * Format currency for display in tables or lists
 * @param amount - Amount to format
 * @param currency - Currency code
 * @param roundingMode - Rounding mode
 * @returns Compact formatted string
 */
export const formatCurrencyCompact = (
  amount: number,
  currency: string = CURRENCY_CONSTANTS.DEFAULT_CURRENCY,
  roundingMode: RoundingMode = RoundingMode.NORMAL,
): string => {
  const roundedAmount = applyRounding(amount, roundingMode);

  // Handle large numbers with suffixes
  if (roundedAmount >= 1000000000) {
    return `${(roundedAmount / 1000000000).toFixed(1)}B ${currency}`;
  } else if (roundedAmount >= 1000000) {
    return `${(roundedAmount / 1000000).toFixed(1)}M ${currency}`;
  } else if (roundedAmount >= 1000) {
    return `${(roundedAmount / 1000).toFixed(1)}K ${currency}`;
  }

  return `${roundedAmount.toFixed(2)} ${currency}`;
};

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
