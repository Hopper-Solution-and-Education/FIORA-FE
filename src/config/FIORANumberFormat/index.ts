import { Currency } from '@/shared/types';
import { FIORA_CURRENCY_CONFIG } from './config';
import { SYMBOL_POSITION } from './constant';

/**
 * FIORANumberFormat class that extends Intl.NumberFormat
 * Provides custom formatting for FIORA platform currencies, especially FX currency
 */
export class FIORANumberFormat extends Intl.NumberFormat {
  private currency: Currency;
  private config: (typeof FIORA_CURRENCY_CONFIG)[keyof typeof FIORA_CURRENCY_CONFIG];

  constructor(currency: Currency, options?: Intl.NumberFormatOptions, locale?: string | string[]) {
    const config = FIORA_CURRENCY_CONFIG[currency];
    if (!config) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    // With VND, always set minimumFractionDigits and maximumFractionDigits to 0
    const isVND = currency === 'VND';
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency === 'FX' ? 'USD' : currency,
      minimumFractionDigits: isVND ? 0 : config.minimumFractionDigits,
      maximumFractionDigits: isVND ? 0 : config.maximumFractionDigits,
      ...options,
    };

    super(locale || config.locale, formatOptions);
    this.currency = currency;
    this.config = config;
  }

  /**
   * Format number with custom currency symbol for FX
   */
  format(value: number | bigint): string {
    if (this.currency === 'FX') {
      return this.formatCustomCurrency(value);
    }
    // With VND, don't show decimal
    if (this.currency === 'VND') {
      // Use Intl.NumberFormat again but force fractionDigits to 0
      const numberFormatter = new Intl.NumberFormat(this.config.locale, {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      return numberFormatter.format(typeof value === 'bigint' ? Number(value) : value);
    }
    return super.format(value);
  }

  /**
   * Format with custom currency symbol and positioning
   */
  private formatCustomCurrency(value: number | bigint): string {
    const numericValue = typeof value === 'bigint' ? Number(value) : value;

    // With FX, if config is VND, don't show decimal
    const isVND = this.currency === 'VND';
    const numberFormatter = new Intl.NumberFormat(this.config.locale, {
      minimumFractionDigits: isVND ? 0 : this.config.minimumFractionDigits,
      maximumFractionDigits: isVND ? 0 : this.config.maximumFractionDigits,
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
   * Get currency symbol
   */
  getCurrencySymbol(): string {
    return this.config.symbol;
  }

  /**
   * Get currency name
   */
  getCurrencyName(): string {
    return this.config.name;
  }

  /**
   * Get currency configuration
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
