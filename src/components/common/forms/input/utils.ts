import {
  FIORANumberFormat,
  formatFIORACurrency,
  getCurrencySymbol,
} from '@/config/FIORANumberFormat';
import { FIORA_CURRENCY_CONFIG } from '@/config/FIORANumberFormat/config';
import { SYMBOL_POSITION } from '@/config/FIORANumberFormat/constant';
import { Currency } from '@/shared/types';

// Constants for number abbreviations
const NUMBER_ABBREVIATIONS = {
  BILLION: {
    threshold: 1_000_000_000,
    divisor: 1_000_000_000,
    suffix: 'B',
  },
  MILLION: {
    threshold: 1_000_000,
    divisor: 1_000_000,
    suffix: 'M',
  },
  THOUSAND: {
    threshold: 1_000,
    divisor: 1_000,
    suffix: 'K',
  },
} as const;

// Type definitions for better type safety
type NumberAbbreviation = (typeof NUMBER_ABBREVIATIONS)[keyof typeof NUMBER_ABBREVIATIONS];

interface FormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

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

/**
 * Determines the appropriate abbreviation for a given number.
 * @param num - The number to check
 * @returns The abbreviation config or null if no abbreviation needed
 */
const getNumberAbbreviation = (num: number): NumberAbbreviation | null => {
  // Check abbreviations in descending order of magnitude
  const abbreviations = Object.values(NUMBER_ABBREVIATIONS);

  for (const abbreviation of abbreviations) {
    if (num >= abbreviation.threshold) {
      return abbreviation;
    }
  }

  return null;
};

/**
 * Formats a number with abbreviation using FIORANumberFormat.
 * @param num - The number to format
 * @param abbreviation - The abbreviation configuration
 * @param currency - The currency to use for formatting
 * @param options - Optional formatting options
 * @returns Formatted abbreviated number string
 */
const formatAbbreviatedNumber = (
  num: number,
  abbreviation: NumberAbbreviation,
  currency: Currency,
  options: FormatOptions = {},
): string => {
  const value = num / abbreviation.divisor;

  const numberFormatter = new FIORANumberFormat(currency, {
    style: 'decimal',
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 1,
  });

  return numberFormatter.format(value);
};

/**
 * Applies currency symbol with proper positioning based on currency configuration.
 * @param formattedValue - The formatted number string
 * @param currency - The currency code
 * @param suffix - Optional suffix (like 'M', 'B')
 * @returns Complete formatted string with currency symbol and suffix
 */
const applyCurrencySymbolAndSuffix = (
  formattedValue: string,
  currency: Currency,
  suffix?: string,
): string => {
  const currencySymbol = getCurrencySymbol(currency);
  const currencyConfig = FIORA_CURRENCY_CONFIG[currency];
  const suffixPart = suffix ? suffix : '';

  // Use currency configuration to determine symbol position
  if (currencyConfig.position === SYMBOL_POSITION.BEFORE) {
    return `${currencySymbol} ${formattedValue}${suffixPart}`;
  } else {
    return `${formattedValue}${suffixPart} ${currencySymbol}`;
  }
};

/**
 * Formats a suggestion value with optional abbreviation and proper currency formatting.
 * Supports billions, millions, and thousands abbreviations with configurable thresholds.
 *
 * @param num - The numeric value to format
 * @param currency - The currency code ('VND', 'USD', 'FX')
 * @param shouldShortened - Whether to apply abbreviations (B, M, K)
 * @param options - Optional formatting configuration
 * @returns Formatted currency string with appropriate abbreviations
 *
 * @example
 * formatSuggestionValue(1500000, 'USD', true) // "$1.5M"
 * formatSuggestionValue(1500000, 'VND', true) // "1.5M ₫"
 * formatSuggestionValue(1500000, 'USD', false) // "$1,500,000.00"
 */
export const formatSuggestionValue = (
  num: number,
  currency: Currency,
  shouldShortened?: boolean,
  options: FormatOptions = {},
): string => {
  // Validate input
  if (typeof num !== 'number' || isNaN(num)) {
    return '';
  }

  // If abbreviation is not requested, use standard formatting
  if (!shouldShortened) {
    return formatFIORACurrency(num, currency);
  }

  // Find appropriate abbreviation
  const abbreviation = getNumberAbbreviation(num);

  if (!abbreviation) {
    // No abbreviation needed, use standard formatting
    return formatFIORACurrency(num, currency);
  }

  // Format the abbreviated number
  const formattedValue = formatAbbreviatedNumber(num, abbreviation, currency, options);

  // Apply currency symbol and suffix based on currency configuration
  return applyCurrencySymbolAndSuffix(formattedValue, currency, abbreviation.suffix);
};

/**
 * Extended formatting function that supports custom abbreviation thresholds.
 * @param num - The number to format
 * @param currency - The currency code
 * @param customThresholds - Custom abbreviation thresholds
 * @param shouldShortened - Whether to apply abbreviations
 * @returns Formatted string
 */
export const formatSuggestionValueWithCustomThresholds = (
  num: number,
  currency: Currency,
  customThresholds: Partial<typeof NUMBER_ABBREVIATIONS>,
  shouldShortened?: boolean,
): string => {
  if (!shouldShortened) {
    return formatFIORACurrency(num, currency);
  }

  // Merge custom thresholds with defaults
  const mergedThresholds = { ...NUMBER_ABBREVIATIONS, ...customThresholds };

  // Find the appropriate threshold
  const abbreviations = Object.values(mergedThresholds);
  const abbreviation = abbreviations.find((abbr) => num >= abbr.threshold);

  if (!abbreviation) {
    return formatFIORACurrency(num, currency);
  }

  const formattedValue = formatAbbreviatedNumber(num, abbreviation, currency);
  return applyCurrencySymbolAndSuffix(formattedValue, currency, abbreviation.suffix);
};
