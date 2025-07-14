import { CURRENCY } from '@/shared/constants';
import { Currency } from '@/shared/types';
import { FIORA_CURRENCY_CONFIG } from './config';
import { SYMBOL_POSITION } from './constant';

/**
 * FIORANumberFormat class that extends Intl.NumberFormat
 * Provides custom formatting for FIORA platform currencies, especially FX currency
 *
 * @description
 * This class handles currency formatting based on configuration defined in config.ts.
 * To modify currency settings (symbols, positions, separators, etc.), please update
 * the FIORA_CURRENCY_CONFIG in config.ts rather than modifying this class directly.
 *
 * @see {@link FIORA_CURRENCY_CONFIG} for currency configuration options
 * @see {@link SYMBOL_POSITION} for symbol positioning constants
 */
export class FIORANumberFormat extends Intl.NumberFormat {
  private currency: Currency;
  private config: (typeof FIORA_CURRENCY_CONFIG)[keyof typeof FIORA_CURRENCY_CONFIG];

  /**
   * Creates a new FIORANumberFormat instance for the specified currency
   *
   * @param currency - The currency to format (USD, VND, FX)
   * @param options - Optional Intl.NumberFormat options to override defaults
   * @param locale - Optional locale override (uses config.ts locale by default)
   *
   * @throws {Error} When currency is not supported in FIORA_CURRENCY_CONFIG
   *
   * @note Currency configuration is loaded from config.ts - modify there for changes
   */
  constructor(currency: Currency, options?: Intl.NumberFormatOptions, locale?: string | string[]) {
    const config = FIORA_CURRENCY_CONFIG[currency];
    if (!config) {
      throw new Error(
        `Unsupported currency: ${currency}. Please add it to FIORA_CURRENCY_CONFIG in config.ts`,
      );
    }

    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency === CURRENCY.FX ? CURRENCY.USD : currency,
      minimumFractionDigits: config.minimumFractionDigits,
      maximumFractionDigits: config.maximumFractionDigits,
      ...options,
    };

    super(locale || config.locale, formatOptions);
    this.currency = currency;
    this.config = config;
  }

  /**
   * Format number with custom currency symbol and positioning
   *
   * @param value - The numeric value to format
   * @returns Formatted currency string based on config.ts settings
   *
   * @note For FX currency, uses custom formatting with symbol positioning from config
   * @note For other currencies, uses standard Intl.NumberFormat with config overrides
   */
  format(value: number | bigint): string {
    if (this.currency === 'FX') {
      return this.formatCustomCurrency(value);
    }

    return super.format(value);
  }

  /**
   * Format with custom currency symbol and positioning for FX currency
   *
   * @param value - The numeric value to format
   * @returns Formatted string with custom symbol positioning
   *
   * @note Uses symbol position, separators, and fraction digits from config.ts
   * @note This method is specifically for FX currency custom formatting
   */
  private formatCustomCurrency(value: number | bigint): string {
    const numericValue = typeof value === 'bigint' ? Number(value) : value;

    const numberFormatter = new Intl.NumberFormat(this.config.locale, {
      minimumFractionDigits: this.config.minimumFractionDigits,
      maximumFractionDigits: this.config.maximumFractionDigits,
    });

    const formattedNumber = numberFormatter.format(numericValue);

    // Add currency symbol based on position
    if (this.config.position === SYMBOL_POSITION.BEFORE) {
      return `${this.config.symbol} ${formattedNumber}`;
    } else {
      return `${formattedNumber} ${this.config.symbol}`;
    }
  }

  /**
   * Get currency symbol from configuration
   */
  getCurrencySymbol(): string {
    return this.config.symbol;
  }

  /**
   * Get currency name from configuration
 
   */
  getCurrencyName(): string {
    return this.config.name;
  }

  /**
   * Get complete currency configuration object

   */
  getConfig() {
    return this.config;
  }

  /**
   * Static method to create formatter for specific currency

   */
  static create(currency: Currency, options?: Intl.NumberFormatOptions): FIORANumberFormat {
    return new FIORANumberFormat(currency, options);
  }

  /**
   * Static method to get all formatters
   */
  static getAllFormatters(): Record<Currency, FIORANumberFormat> {
    return {
      USD: new FIORANumberFormat('USD'),
      VND: new FIORANumberFormat('VND'),
      FX: new FIORANumberFormat('FX'),
    };
  }

  /**
   * Static method to format value with specific currency
   */
  static format(
    value: number | bigint,
    currency: Currency,
    options?: Intl.NumberFormatOptions,
  ): string {
    const formatter = new FIORANumberFormat(currency, options);
    return formatter.format(value);
  }
}

/**
 * Utility function to format currency using FIORANumberFormat
 */
export const formatFIORACurrency = (
  value: number | bigint,
  currency: Currency,
  options?: Intl.NumberFormatOptions,
): string => {
  return FIORANumberFormat.format(value, currency, options);
};

/**
 * Get currency symbol for specific currency
 */
export const getCurrencySymbol = (currency: Currency): string => {
  return FIORA_CURRENCY_CONFIG[currency].symbol;
};

/**
 * Get currency name for specific currency
 */
export const getCurrencyName = (currency: Currency): string => {
  return FIORA_CURRENCY_CONFIG[currency].name;
};

/**
 * Check if currency is FX
 */
export const isFXCurrency = (currency: Currency): boolean => {
  return currency === 'FX';
};

/**
 * Get all available currencies
 */
export const getAvailableCurrencies = (): Currency[] => {
  return Object.keys(FIORA_CURRENCY_CONFIG) as Currency[];
};
