import { Currency } from '@prisma/client';

// Constants for easy customization
export const FIORA_CURRENCY_CONFIG = {
  FX: {
    symbol: '₣', // FIORA currency symbol
    name: 'FIORA',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: 'before' as const, // 'before' | 'after'
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: 'before' as const,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  VND: {
    symbol: '₫',
    name: 'Vietnamese Dong',
    locale: 'vi-VN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    position: 'after' as const,
    thousandSeparator: '.',
    decimalSeparator: ',',
  },
} as const;

export type FIORACurrencyConfig = typeof FIORA_CURRENCY_CONFIG;

/**
 * FIORANumberFormat class that extends Intl.NumberFormat
 * Provides custom formatting for FIORA platform currencies, especially FX currency
 */
export class FIORANumberFormat extends Intl.NumberFormat {
  private currency: Currency;
  private config: typeof FIORA_CURRENCY_CONFIG[keyof typeof FIORA_CURRENCY_CONFIG];

  constructor(
    currency: Currency,
    options?: Intl.NumberFormatOptions,
    locale?: string | string[]
  ) {
    const config = FIORA_CURRENCY_CONFIG[currency];
    
    // Use custom config or fallback to standard Intl.NumberFormat
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency === 'FX' ? 'USD' : currency, // Use USD as base for FX
      minimumFractionDigits: config.minimumFractionDigits,
      maximumFractionDigits: config.maximumFractionDigits,
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
    
    return super.format(value);
  }

  /**
   * Format with custom currency symbol and positioning
   */
  private formatCustomCurrency(value: number | bigint): string {
    const numericValue = typeof value === 'bigint' ? Number(value) : value;
    
    // Format the number part
    const numberFormatter = new Intl.NumberFormat(this.config.locale, {
      minimumFractionDigits: this.config.minimumFractionDigits,
      maximumFractionDigits: this.config.maximumFractionDigits,
    });
    
    const formattedNumber = numberFormatter.format(numericValue);
    
    // Add currency symbol based on position
    if (this.config.position === 'before') {
      return `${this.config.symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber}${this.config.symbol}`;
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
  static format(value: number | bigint, currency: Currency, options?: Intl.NumberFormatOptions): string {
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
  options?: Intl.NumberFormatOptions
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
