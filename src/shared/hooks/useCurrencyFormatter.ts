import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { Response } from '@/shared/types/Common.types';
import { RootState } from '@/store';
import { updateExchangeRatesWithTimestamp } from '@/store/slices/setting.slice';
import { CurrencyObjectType, CurrencyType } from '@/store/types/setting.type';
import { Currency } from '@prisma/client';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { CACHE_KEY, EXCHANGE_RATE_STALE_TIME } from '../constants/exchangeRates';
import {
  type CurrencyFormatterOptions,
  type ExchangeAmountParams,
  type ExchangeAmountResult,
  type ExchangeRateResponse,
} from '../types';

// Constants for localStorage caching
const apiEndpoint = '/api/setting/currency-setting/USD';

type CachedExchangeRateData = {
  rates: CurrencyType;
  updatedAt: number;
  baseCurrency: string;
};

type UseCurrencyFormatterReturn = {
  // Core functions
  formatCurrency: (
    amount: number,
    currency: CurrencyObjectType | string,
    options?: CurrencyFormatterOptions,
  ) => string;
  getExchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult;

  // Data fetching
  mutate: () => Promise<Response<ExchangeRateResponse> | null | undefined>;
  refreshExchangeRates: () => Promise<void>;

  // State
  exchangeRates: CurrencyType;
  baseCurrency: string;
  selectedCurrency: Currency;
  isLoading: boolean;
  error: any;

  // Utilities
  getSupportedCurrencies: () => string[];
  getExchangeRate: (fromCurrency: string, toCurrency: string) => number | null;
};

/**
 * Helper function to get cached exchange rate data from localStorage
 */
const getCachedExchangeRates = (): CachedExchangeRateData | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedExchangeRateData = JSON.parse(cached);
    return data;
  } catch {
    return null;
  }
};

/**
 * Helper function to save exchange rate data to localStorage
 */
const setCachedExchangeRates = (data: CachedExchangeRateData): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore cache write errors
  }
};

/**
 * Helper function to check if cached data is stale (older than 6 hours)
 */
const isCacheStale = (updatedAt: number): boolean => {
  const now = Date.now();
  return now - updatedAt > EXCHANGE_RATE_STALE_TIME;
};

/**
 * Custom hook for currency formatting and exchange rate management
 * Integrates with Redux store and provides comprehensive currency operations
 *
 * @param baseCurrency - Optional base currency for exchange rate calculations
 * @returns Object containing all currency-related functions and state
 */
const useCurrencyFormatter = (baseCurrency?: string): UseCurrencyFormatterReturn => {
  const dispatch = useDispatch();

  // Get state from Redux store
  const {
    currency: selectedCurrency,
    baseCurrency: storeBaseCurrency,
    exchangeRate: exchangeRates,
    updatedAt: storeUpdatedAt,
  } = useSelector((state: RootState) => state.settings);

  const effectiveBaseCurrency = baseCurrency || storeBaseCurrency;

  // Data fetching with useDataFetcher
  const { isLoading, error, mutate } = useDataFetcher<ExchangeRateResponse>({
    endpoint: apiEndpoint,
    method: 'GET',
    refreshInterval: EXCHANGE_RATE_STALE_TIME,
  });

  /**
   * Checks if exchange rate data is valid and triggers refresh if needed
   * Now includes localStorage caching with 6-hour stale time
   */
  const ensureExchangeRateData = useCallback(async (): Promise<boolean> => {
    // First, check if we have valid data in Redux store
    const hasStoreData = Object.keys(exchangeRates).length > 0;
    const isStoreDataStale = isCacheStale(storeUpdatedAt);

    // If store has valid, non-stale data, we're good
    if (hasStoreData && !isStoreDataStale) {
      return true;
    }

    // Check localStorage cache
    const cachedData = getCachedExchangeRates();

    if (cachedData) {
      const isCachedDataStale = isCacheStale(cachedData.updatedAt);

      if (!isCachedDataStale) {
        // Use cached data if it's fresh
        dispatch(
          updateExchangeRatesWithTimestamp({
            rates: cachedData.rates,
            updatedAt: cachedData.updatedAt,
          }),
        );
        return true;
      }
    }

    // Fetch fresh data from API
    try {
      const response = await mutate();

      if (response?.data?.conversion_rates) {
        const formattedRates: CurrencyType = {};
        const baseCurrency = response.data.base_code;
        const updatedAt = Date.now();

        // Convert API response to our exchange rate format
        Object.entries(response.data.conversion_rates).forEach(([currency, rate]) => {
          formattedRates[currency] = {
            rate: rate as number,
            suffix: response.data.currency_suffix?.[currency] || currency,
          };
        });

        // Update Redux store with timestamp
        dispatch(
          updateExchangeRatesWithTimestamp({
            rates: formattedRates,
            updatedAt,
          }),
        );

        // Cache data in localStorage
        setCachedExchangeRates({
          rates: formattedRates,
          updatedAt,
          baseCurrency,
        });

        return true;
      }
      return false;
    } catch {
      toast.error('Failed to fetch current exchange rates. Using cached data if available.');

      // If API fails but we have stale cached data, use it as fallback
      if (cachedData) {
        dispatch(
          updateExchangeRatesWithTimestamp({
            rates: cachedData.rates,
            updatedAt: cachedData.updatedAt,
          }),
        );
        return true;
      }

      return false;
    }
  }, [exchangeRates, storeUpdatedAt, mutate, dispatch]);

  /**
   * Gets exchange rate between two currencies
   */
  const getExchangeRate = useCallback(
    (fromCurrency: string, toCurrency: string): number | null => {
      // Compare currency suffixes instead of object references
      if (fromCurrency === toCurrency) return 1;
      // Try to get rates from the stored exchange rates first
      const storedFromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates];
      const storedToRate = exchangeRates[toCurrency as keyof typeof exchangeRates];

      // If both rates are available in store, use them
      if (storedFromRate && storedToRate) {
        return storedToRate.rate / storedFromRate.rate;
      }

      // If one currency is the base currency, handle direct conversion
      if (fromCurrency === effectiveBaseCurrency && storedToRate) {
        return storedToRate.rate;
      }

      if (toCurrency === effectiveBaseCurrency && storedFromRate) {
        return 1 / storedFromRate.rate;
      }

      // Try to use cached data from localStorage if store doesn't have data
      const cachedData = getCachedExchangeRates();
      if (cachedData?.rates) {
        const cachedFromRate = cachedData.rates[fromCurrency];
        const cachedToRate = cachedData.rates[toCurrency];

        if (cachedFromRate && cachedToRate) {
          return cachedToRate.rate / cachedFromRate.rate;
        }

        // Handle base currency conversions with cached data
        if (fromCurrency === effectiveBaseCurrency && cachedToRate) {
          return cachedToRate.rate;
        }

        if (toCurrency === effectiveBaseCurrency && cachedFromRate) {
          return 1 / cachedFromRate.rate;
        }
      }

      // If we have partial data from either source, try to use it
      const finalFromRate = storedFromRate || cachedData?.rates[fromCurrency];
      const finalToRate = storedToRate || cachedData?.rates[toCurrency];

      if (finalFromRate && finalToRate) {
        return finalToRate.rate / finalFromRate.rate;
      }

      return null;
    },
    [exchangeRates, effectiveBaseCurrency],
  );

  /**
   * Formats a number as currency using FIORA number formatting
   * Automatically converts between currencies if different from selected currency (when applyExchangeRate is true)
   * Automatically fetches exchange rates if not available
   *
   * @param amount - The numeric amount to format
   * @param currency - Currency code (string) or currency object
   * @param options - Formatting options including applyExchangeRate flag
   * @param options.applyExchangeRate - Whether to apply automatic currency conversion (default: true)
   * @param options.shouldShortened - Whether to use shortened format (K, M, B) for large numbers
   */
  const formatCurrency = useCallback(
    (
      amount: number,
      currency: CurrencyObjectType | string,
      options: CurrencyFormatterOptions = {},
    ): string => {
      try {
        // Handle null/undefined inputs gracefully and ensure number conversion
        if (amount == null || amount === undefined) {
          amount = 0;
        }

        // Ensure amount is a number (handle string inputs from database)
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount);
        if (isNaN(numericAmount)) {
          return '0.00';
        }
        amount = numericAmount;

        if (!currency) {
          // Even without currency, format the number properly
          return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        }

        const { shouldShortened = false, applyExchangeRate = true } = options;

        // If applyExchangeRate is false, just format with the original currency
        if (!applyExchangeRate) {
          let currencySymbol: string = '';

          if (typeof currency === 'string') {
            // For string currency codes, look up the suffix from exchange rates
            const currencyObj = exchangeRates[currency];
            currencySymbol = currencyObj?.suffix || currency;
          } else if (currency && typeof currency === 'object' && 'suffix' in currency) {
            // Use the currency object's suffix
            currencySymbol = currency.suffix || '';
          }

          // Handle shortened format
          if (shouldShortened && Math.abs(amount) >= 1000) {
            let formattedValue = amount;
            let suffix = '';

            if (Math.abs(amount) >= 1_000_000_000) {
              formattedValue = amount / 1_000_000_000;
              suffix = 'B';
            } else if (Math.abs(amount) >= 1_000_000) {
              formattedValue = amount / 1_000_000;
              suffix = 'M';
            } else if (Math.abs(amount) >= 1_000) {
              formattedValue = amount / 1_000;
              suffix = 'K';
            }

            const formattedNumber = formattedValue.toFixed(2);
            return `${currencySymbol}${formattedNumber}${suffix}`;
          }

          // For non-shortened format, use standard currency formatting
          return `${currencySymbol}${amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }

        // Check and ensure exchange rate data is available for exchange rate operations
        ensureExchangeRateData();

        // Get currency code from input
        let inputCurrencyCode: string;
        if (typeof currency === 'string') {
          inputCurrencyCode = currency;
        } else {
          // For currency objects, we need to find the matching currency code
          const currencySuffix = currency.suffix;
          inputCurrencyCode =
            Object.keys(exchangeRates).find(
              (code) => exchangeRates[code].suffix === currencySuffix,
            ) || 'USD'; // fallback to USD if not found
        }

        // Apply exchange rate conversion to selected currency
        let finalAmount = amount;
        let targetCurrencyCode: string = selectedCurrency;

        if (inputCurrencyCode !== selectedCurrency) {
          // Convert from input currency to selected currency with exchange rate
          const exchangeRate = getExchangeRate(inputCurrencyCode, selectedCurrency);

          if (exchangeRate !== null) {
            finalAmount = Number((amount * exchangeRate).toFixed(2));
          } else {
            // Keep original currency if conversion is not possible
            targetCurrencyCode = inputCurrencyCode;
            finalAmount = amount;
          }
        }

        // Get target currency object for formatting
        let targetCurrencyObj: CurrencyObjectType;
        if (typeof currency === 'string' && targetCurrencyCode === inputCurrencyCode) {
          // Use original currency if no conversion happened
          targetCurrencyObj = exchangeRates[targetCurrencyCode];
          if (!targetCurrencyObj) {
            return `${targetCurrencyCode} ${finalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          }
        } else if (typeof currency !== 'string' && targetCurrencyCode === inputCurrencyCode) {
          // Use the passed currency object if no conversion happened
          targetCurrencyObj = currency;
        } else {
          // Use the target currency object after conversion
          targetCurrencyObj = exchangeRates[targetCurrencyCode];
          if (!targetCurrencyObj) {
            return `${targetCurrencyCode} ${finalAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          }
        }

        // Handle shortened format
        if (shouldShortened && Math.abs(finalAmount) >= 1000) {
          let formattedValue = finalAmount;
          let suffix = '';

          if (Math.abs(finalAmount) >= 1_000_000_000) {
            formattedValue = finalAmount / 1_000_000_000;
            suffix = 'B';
          } else if (Math.abs(finalAmount) >= 1_000_000) {
            formattedValue = finalAmount / 1_000_000;
            suffix = 'M';
          } else if (Math.abs(finalAmount) >= 1_000) {
            formattedValue = finalAmount / 1_000;
            suffix = 'K';
          }

          // Format with 2 decimal places and add currency symbol at the beginning
          const formattedNumber = formattedValue.toFixed(2);
          return `${targetCurrencyObj.suffix ?? ''}${formattedNumber}${suffix}`;
        }

        // For non-shortened format, use standard currency formatting
        return `${targetCurrencyObj.suffix ?? ''}${finalAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      } catch {
        toast.error('Error formatting currency. Please try again.');
        // Safe fallback that maintains proper number formatting
        const fallbackAmount =
          typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount) || 0;
        return fallbackAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
    },
    [ensureExchangeRateData, exchangeRates, selectedCurrency, getExchangeRate],
  );

  /**
   * Exchanges amount between currencies with detailed result
   * Automatically fetches exchange rates if not available
   * Now uses the same robust logic as formatCurrency for consistent calculations
   */
  const getExchangeAmount = useCallback(
    (params: ExchangeAmountParams): ExchangeAmountResult => {
      try {
        const { amount: inputAmount, fromCurrency, toCurrency } = params;

        // Handle null/undefined inputs gracefully and ensure number conversion
        let amount = inputAmount;
        if (amount == null || amount === undefined) {
          amount = 0;
        }

        // Ensure amount is a number (handle string inputs from database)
        const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : Number(amount);
        if (isNaN(numericAmount)) {
          amount = 0;
        } else {
          amount = numericAmount;
        }

        // Check and ensure exchange rate data is available
        ensureExchangeRateData();

        // Handle same currency conversion
        if (fromCurrency === toCurrency) {
          const currencyObj = exchangeRates[toCurrency];
          const fallbackCurrencyObj = { rate: 1, suffix: toCurrency };

          return {
            convertedAmount: amount,
            originalAmount: amount,
            fromCurrency: fromCurrency,
            toCurrency: toCurrency,
            exchangeRate: 1,
            formattedAmount: formatCurrency(amount, currencyObj || fallbackCurrencyObj, {
              applyExchangeRate: false,
            }),
          };
        }

        // Get input currency code - handle both string and object inputs
        const inputCurrencyCode: string = fromCurrency;

        // Apply exchange rate conversion logic (similar to formatCurrency)
        let finalAmount = amount;
        let targetCurrencyCode: string = toCurrency;
        let actualExchangeRate: number = 1;

        if (inputCurrencyCode !== toCurrency) {
          // Convert from input currency to target currency with exchange rate

          if (exchangeRates !== null) {
            finalAmount = Number((amount * exchangeRates[toCurrency].rate).toFixed(2));
            actualExchangeRate = exchangeRates[toCurrency].rate;
          } else {
            // Keep original currency and amount if conversion is not possible
            targetCurrencyCode = inputCurrencyCode;
            finalAmount = amount;
            actualExchangeRate = 1;
          }
        }

        // Get target currency object for formatting
        let targetCurrencyObj: CurrencyObjectType;
        if (targetCurrencyCode === inputCurrencyCode) {
          // Use original currency if no conversion happened
          targetCurrencyObj = exchangeRates[targetCurrencyCode];
          if (!targetCurrencyObj) {
            targetCurrencyObj = { rate: 1, suffix: targetCurrencyCode };
          }
        } else {
          // Use the target currency object after conversion
          targetCurrencyObj = exchangeRates[targetCurrencyCode];
          if (!targetCurrencyObj) {
            targetCurrencyObj = { rate: 1, suffix: targetCurrencyCode };
          }
        }

        return {
          convertedAmount: finalAmount,
          originalAmount: amount,
          fromCurrency: inputCurrencyCode,
          toCurrency: targetCurrencyCode,
          exchangeRate: actualExchangeRate,
          formattedAmount: formatCurrency(finalAmount, targetCurrencyObj, {
            applyExchangeRate: false,
          }),
        };
      } catch {
        toast.error('Error calculating exchange amount. Please try again.');

        // Safe fallback
        const fallbackAmount =
          typeof params.amount === 'string'
            ? parseFloat(params.amount) || 0
            : Number(params.amount) || 0;
        const fallbackCurrencyObj = exchangeRates[params.toCurrency] || {
          rate: 1,
          suffix: params.toCurrency,
        };

        return {
          convertedAmount: fallbackAmount,
          originalAmount: fallbackAmount,
          fromCurrency: params.fromCurrency,
          toCurrency: params.toCurrency,
          exchangeRate: 1,
          formattedAmount: formatCurrency(fallbackAmount, fallbackCurrencyObj, {
            applyExchangeRate: false,
          }),
        };
      }
    },
    [formatCurrency, getExchangeRate, ensureExchangeRateData, exchangeRates],
  );

  /**
   * Refreshes exchange rates from API and updates store
   * Now includes localStorage caching
   */
  const refreshExchangeRates = useCallback(async (): Promise<void> => {
    try {
      const response = await mutate();

      if (response?.data?.conversion_rates) {
        const formattedRates: CurrencyType = {};
        const baseCurrency = response.data.base_code;
        const updatedAt = Date.now();

        // Convert API response to our exchange rate format
        Object.entries(response.data.conversion_rates).forEach(([currency, rate]) => {
          formattedRates[currency] = {
            rate: rate as number,
            suffix: response.data.currency_suffix?.[currency] || currency,
          };
        });

        // Update Redux store with timestamp
        dispatch(
          updateExchangeRatesWithTimestamp({
            rates: formattedRates,
            updatedAt,
          }),
        );

        // Cache data in localStorage
        setCachedExchangeRates({
          rates: formattedRates,
          updatedAt,
          baseCurrency,
        });

        toast.success('Exchange rates updated successfully');
      } else {
        toast.warning('No exchange rate data received from server');
      }
    } catch (error) {
      toast.error('Failed to refresh exchange rates. Please check your connection and try again.');
      throw error; // Re-throw to allow error handling in calling functions
    }
  }, []);

  /**
   * Gets list of supported currencies
   */
  const getSupportedCurrencies = useCallback((): string[] => {
    const currencies = new Set<string>();

    // Add currencies from exchange rates (keys are currency codes now)
    Object.keys(exchangeRates).forEach((currency) => {
      currencies.add(currency);
    });

    return Array.from(currencies).sort();
  }, [exchangeRates]);

  return {
    // Core functions
    formatCurrency,
    getExchangeAmount,

    // Data fetching
    mutate,
    refreshExchangeRates,

    // State
    exchangeRates,
    baseCurrency: effectiveBaseCurrency,
    selectedCurrency,
    isLoading,
    error,

    // Utilities
    getSupportedCurrencies,
    getExchangeRate,
  };
};

export default useCurrencyFormatter;
export type {
  CurrencyFormatterOptions,
  ExchangeAmountParams,
  ExchangeAmountResult,
  UseCurrencyFormatterReturn,
};
