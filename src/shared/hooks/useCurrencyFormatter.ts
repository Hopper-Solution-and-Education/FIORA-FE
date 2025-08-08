'use client';

import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { Response } from '@/shared/types/Common.types';
import { RootState } from '@/store';
import { updateExchangeRatesWithTimestamp } from '@/store/slices/setting.slice';
import { CurrencyObjectType, CurrencyType } from '@/store/types/setting.type';
import { Currency } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { CACHE_KEY, EXCHANGE_RATE_STALE_TIME } from '../constants/exchangeRates';
import {
  type CurrencyFormatterOptions,
  type ExchangeAmountParams,
  type ExchangeAmountResult,
  type ExchangeRateResponse,
} from '../types';

// Constants
const API_ENDPOINT = '/api/setting/currency-setting/USD';
const CURRENCY_FRACTION_DIGITS = 2;
const SHORTENING_THRESHOLDS = {
  BILLION: 1_000_000_000,
  MILLION: 1_000_000,
  THOUSAND: 1_000,
} as const;
const SHORTENING_SUFFIXES = {
  BILLION: 'B',
  MILLION: 'M',
  THOUSAND: 'K',
} as const;

// Types
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

// Utility functions for cache management
const cacheUtilities = {
  /**
   * Gets cached exchange rate data from localStorage
   */
  getCachedExchangeRates: (userId: string): CachedExchangeRateData | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}-${userId}`);
      if (!cached) return null;

      const data: CachedExchangeRateData = JSON.parse(cached);
      return data;
    } catch {
      return null;
    }
  },

  /**
   * Saves exchange rate data to localStorage
   */
  setCachedExchangeRates: (userId: string, data: CachedExchangeRateData): void => {
    try {
      localStorage.setItem(`${CACHE_KEY}-${userId}`, JSON.stringify(data));
    } catch {
      // Silently ignore cache write errors
    }
  },

  /**
   * Checks if cached data is stale (older than 6 hours)
   */
  isCacheStale: (updatedAt: number): boolean => {
    const now = Date.now();
    return now - updatedAt > EXCHANGE_RATE_STALE_TIME;
  },
};

// Utility functions for number handling
const numberUtilities = {
  /**
   * Safely converts input to a numeric value
   */
  toSafeNumber: (value: any): number => {
    if (value == null || value === undefined) return 0;
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : Number(value);
    return isNaN(numericValue) ? 0 : numericValue;
  },

  /**
   * Formats a number with proper fraction digits
   */
  formatWithPrecision: (
    value: number,
    fractionDigits: number = CURRENCY_FRACTION_DIGITS,
  ): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
  },

  /**
   * Applies shortening format to large numbers
   */
  applyShortening: (value: number): { formattedValue: number; suffix: string } => {
    const absValue = Math.abs(value);

    if (absValue >= SHORTENING_THRESHOLDS.BILLION) {
      return {
        formattedValue: value / SHORTENING_THRESHOLDS.BILLION,
        suffix: SHORTENING_SUFFIXES.BILLION,
      };
    }
    if (absValue >= SHORTENING_THRESHOLDS.MILLION) {
      return {
        formattedValue: value / SHORTENING_THRESHOLDS.MILLION,
        suffix: SHORTENING_SUFFIXES.MILLION,
      };
    }
    if (absValue >= SHORTENING_THRESHOLDS.THOUSAND) {
      return {
        formattedValue: value / SHORTENING_THRESHOLDS.THOUSAND,
        suffix: SHORTENING_SUFFIXES.THOUSAND,
      };
    }

    return { formattedValue: value, suffix: '' };
  },
};

// Utility functions for currency operations
const currencyUtilities = {
  /**
   * Extracts currency code from currency input
   */
  extractCurrencyCode: (
    currency: CurrencyObjectType | string,
    exchangeRates: CurrencyType,
  ): string => {
    if (typeof currency === 'string') {
      return currency;
    }

    // For currency objects, find the matching currency code by suffix
    const currencySuffix = currency.suffix;
    return (
      Object.keys(exchangeRates).find((code) => exchangeRates[code].suffix === currencySuffix) ||
      'USD'
    ); // fallback to USD if not found
  },

  /**
   * Gets currency symbol/suffix from currency input
   */
  getCurrencySymbol: (
    currency: CurrencyObjectType | string,
    exchangeRates: CurrencyType,
  ): string => {
    if (typeof currency === 'string') {
      // For string currency codes, look up the suffix from exchange rates
      const currencyObj = exchangeRates[currency];
      return currencyObj?.suffix || currency;
    } else if (currency && typeof currency === 'object' && 'suffix' in currency) {
      // Use the currency object's suffix
      return currency.suffix || '';
    }
    return '';
  },

  /**
   * Creates a fallback currency object
   */
  createFallbackCurrency: (currencyCode: string): CurrencyObjectType => ({
    rate: 1,
    suffix: currencyCode,
  }),
};

// Utility functions for data management
const dataUtilities = {
  /**
   * Checks if exchange rate data needs to be fetched
   * Prioritizes localStorage cache over Redux store data
   */
  shouldFetchExchangeRates: (
    userId: string,
    exchangeRates: CurrencyType,
    storeUpdatedAt: number,
  ): boolean => {
    // First check localStorage cache
    const cachedData = cacheUtilities.getCachedExchangeRates(userId);

    if (cachedData) {
      const isCachedDataStale = cacheUtilities.isCacheStale(cachedData.updatedAt);
      // If we have fresh cached data, no need to fetch
      if (!isCachedDataStale) {
        return false;
      }
    }

    // Fallback: check store data
    const hasStoreData = Object.keys(exchangeRates).length > 0;
    const isStoreDataStale = cacheUtilities.isCacheStale(storeUpdatedAt);

    // Only use store data if cache is unavailable/stale
    if (hasStoreData && !isStoreDataStale) {
      return false;
    }

    // If both cache and store are stale or empty, we need to fetch
    return true;
  },

  /**
   * Processes exchange rate API response into standardized format
   */
  processExchangeRateResponse: (
    response: Response<ExchangeRateResponse>,
    dispatch: any,
    userId: string,
  ): boolean => {
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
    cacheUtilities.setCachedExchangeRates(userId, {
      rates: formattedRates,
      updatedAt,
      baseCurrency,
    });

    return true;
  },
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

  const { data: userData } = useSession();

  const effectiveBaseCurrency = baseCurrency || storeBaseCurrency;

  // Data fetching with useDataFetcher - remove refreshInterval to prevent automatic requests
  const {
    isLoading,
    error,
    mutate: originalMutate,
  } = useDataFetcher<ExchangeRateResponse>({
    endpoint: API_ENDPOINT,
    method: 'GET',
  });

  // Ref to track ongoing API requests and prevent concurrent calls
  const fetchingRef = useRef<Promise<boolean> | null>(null);

  /**
   * Shared function to process API response and update store/cache
   */
  const processExchangeRateResponse = useCallback(
    (response: Response<ExchangeRateResponse>) => {
      return dataUtilities.processExchangeRateResponse(
        response,
        dispatch,
        userData?.user?.id || '',
      );
    },
    [dispatch],
  );

  /**
   * Enhanced mutate function that always forces a fresh fetch and replaces old data
   */
  const mutate = useCallback(async (): Promise<
    Response<ExchangeRateResponse> | null | undefined
  > => {
    // Clear any existing fetch promise to force a fresh request
    fetchingRef.current = null;

    const response = await originalMutate();

    if (response?.data?.conversion_rates) {
      processExchangeRateResponse(response);
    }

    return response;
  }, [originalMutate, processExchangeRateResponse]);

  /**
   * Checks if exchange rate data is valid and triggers refresh if needed
   * Prioritizes localStorage cache over Redux store data
   */
  const ensureExchangeRateData = useCallback(async (): Promise<boolean> => {
    // Return existing promise if already fetching to prevent concurrent calls
    if (fetchingRef.current) {
      return fetchingRef.current;
    }

    // First, check localStorage cache as primary source
    const cachedData = cacheUtilities.getCachedExchangeRates(userData?.user?.id || '');

    if (cachedData) {
      const isCachedDataStale = cacheUtilities.isCacheStale(cachedData.updatedAt);

      if (!isCachedDataStale) {
        // Use cached data if it's fresh and update Redux store to sync
        dispatch(
          updateExchangeRatesWithTimestamp({
            rates: cachedData.rates,
            updatedAt: cachedData.updatedAt,
          }),
        );
        return true;
      }
    }

    // Fallback: check if we have valid data in Redux store only if cache is not available or stale
    const hasStoreData = Object.keys(exchangeRates).length > 0;
    const isStoreDataStale = cacheUtilities.isCacheStale(storeUpdatedAt);

    // Only use store data if cache is unavailable/stale and store data is fresh
    if (
      hasStoreData &&
      !isStoreDataStale &&
      (!cachedData || cacheUtilities.isCacheStale(cachedData.updatedAt))
    ) {
      // Update localStorage with current store data
      cacheUtilities.setCachedExchangeRates(userData?.user?.id || '', {
        rates: exchangeRates,
        updatedAt: storeUpdatedAt,
        baseCurrency: effectiveBaseCurrency,
      });
      return true;
    }

    // Create a promise for the API call to prevent concurrent requests
    const fetchPromise = (async (): Promise<boolean> => {
      try {
        const response = await originalMutate();

        if (response?.data?.conversion_rates) {
          return processExchangeRateResponse(response);
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
      } finally {
        // Clear the ref when done
        fetchingRef.current = null;
      }
    })();

    // Store the promise to prevent concurrent calls
    fetchingRef.current = fetchPromise;
    return fetchPromise;
  }, [exchangeRates, storeUpdatedAt, originalMutate, dispatch, processExchangeRateResponse]);

  /**
   * Gets exchange rate between two currencies
   * Prioritizes localStorage cache over Redux store data
   */
  const getExchangeRate = useCallback(
    (fromCurrency: string, toCurrency: string): number | null => {
      // Compare currency suffixes instead of object references
      if (fromCurrency === toCurrency) return 1;

      // First, try to get rates from localStorage cache
      const cachedData = cacheUtilities.getCachedExchangeRates(userData?.user?.id || '');
      if (cachedData?.rates && !cacheUtilities.isCacheStale(cachedData.updatedAt)) {
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

      // Fallback: try to get rates from the stored exchange rates
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

      // Final fallback: try to use stale cached data if store doesn't have data
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
        // Convert to safe numeric value
        amount = numberUtilities.toSafeNumber(amount);

        if (!currency) {
          // Even without currency, format the number properly
          return numberUtilities.formatWithPrecision(amount);
        }

        const { shouldShortened = false, applyExchangeRate = true } = options;

        // If applyExchangeRate is false, just format with the original currency
        if (!applyExchangeRate) {
          const currencySymbol = currencyUtilities.getCurrencySymbol(currency, exchangeRates);

          // Handle shortened format
          if (shouldShortened && Math.abs(amount) >= SHORTENING_THRESHOLDS.THOUSAND) {
            const { formattedValue, suffix } = numberUtilities.applyShortening(amount);
            const formattedNumber = formattedValue.toFixed(2);
            return `${currencySymbol}${formattedNumber}${suffix}`;
          }

          // For non-shortened format, use standard currency formatting
          return `${currencySymbol}${numberUtilities.formatWithPrecision(amount)}`;
        }

        // Check if we have exchange rate data available, prioritizing cache over store
        if (
          dataUtilities.shouldFetchExchangeRates(
            userData?.user?.id || '',
            exchangeRates,
            storeUpdatedAt,
          )
        ) {
          // Fire and forget - don't block the formatting operation
          ensureExchangeRateData().catch(() => {
            // Silently handle errors - fallback logic will handle it
          });
        }

        // Get currency code from input
        const inputCurrencyCode = currencyUtilities.extractCurrencyCode(currency, exchangeRates);

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
            return `${targetCurrencyCode} ${numberUtilities.formatWithPrecision(finalAmount)}`;
          }
        } else if (typeof currency !== 'string' && targetCurrencyCode === inputCurrencyCode) {
          // Use the passed currency object if no conversion happened
          targetCurrencyObj = currency;
        } else {
          // Use the target currency object after conversion
          targetCurrencyObj = exchangeRates[targetCurrencyCode];
          if (!targetCurrencyObj) {
            return `${targetCurrencyCode} ${numberUtilities.formatWithPrecision(finalAmount)}`;
          }
        }

        // Handle shortened format
        if (shouldShortened && Math.abs(finalAmount) >= SHORTENING_THRESHOLDS.THOUSAND) {
          const { formattedValue, suffix } = numberUtilities.applyShortening(finalAmount);
          const formattedNumber = formattedValue.toFixed(2);
          return `${targetCurrencyObj.suffix ?? ''}${formattedNumber}${suffix}`;
        }

        // For non-shortened format, use standard currency formatting
        return `${targetCurrencyObj.suffix ?? ''}${numberUtilities.formatWithPrecision(finalAmount)}`;
      } catch {
        toast.error('Error formatting currency. Please try again.');
        // Safe fallback that maintains proper number formatting
        const fallbackAmount = numberUtilities.toSafeNumber(amount);
        return numberUtilities.formatWithPrecision(fallbackAmount);
      }
    },
    [ensureExchangeRateData, exchangeRates, selectedCurrency, getExchangeRate, storeUpdatedAt],
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

        // Convert to safe numeric value
        const amount = numberUtilities.toSafeNumber(inputAmount);

        // Check if we have exchange rate data available, prioritizing cache over store
        if (
          dataUtilities.shouldFetchExchangeRates(
            userData?.user?.id || '',
            exchangeRates,
            storeUpdatedAt,
          )
        ) {
          // Fire and forget - don't block the operation
          ensureExchangeRateData().catch(() => {
            // Silently handle errors - fallback logic will handle it
          });
        }

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
          const exchangeRate = getExchangeRate(inputCurrencyCode, toCurrency);

          if (exchangeRate !== null) {
            finalAmount = Number((amount * exchangeRate).toFixed(2));
            actualExchangeRate = exchangeRate;
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
            targetCurrencyObj = currencyUtilities.createFallbackCurrency(targetCurrencyCode);
          }
        } else {
          // Use the target currency object after conversion
          targetCurrencyObj = exchangeRates[targetCurrencyCode];
          if (!targetCurrencyObj) {
            targetCurrencyObj = currencyUtilities.createFallbackCurrency(targetCurrencyCode);
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
        const fallbackAmount = numberUtilities.toSafeNumber(params.amount);
        const fallbackCurrencyObj =
          exchangeRates[params.toCurrency] ||
          currencyUtilities.createFallbackCurrency(params.toCurrency);

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
    [formatCurrency, getExchangeRate, ensureExchangeRateData, exchangeRates, storeUpdatedAt],
  );

  /**
   * Refreshes exchange rates from API and updates store
   * Always forces a fresh fetch and replaces old data
   */
  const refreshExchangeRates = useCallback(async (): Promise<void> => {
    try {
      // Clear the ref to force a fresh fetch even if data exists
      fetchingRef.current = null;

      const response = await originalMutate();

      if (response?.data?.conversion_rates) {
        processExchangeRateResponse(response);
        toast.success('Exchange rates updated successfully');
      } else {
        toast.warning('No exchange rate data received from server');
      }
    } catch (error) {
      toast.error('Failed to refresh exchange rates. Please check your connection and try again.');
      throw error; // Re-throw to allow error handling in calling functions
    }
  }, [originalMutate, processExchangeRateResponse]);

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
