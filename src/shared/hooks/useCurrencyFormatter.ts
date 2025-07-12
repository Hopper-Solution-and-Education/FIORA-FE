import { formatFIORACurrency, getCurrencySymbol } from '@/config/FIORANumberFormat';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { Response } from '@/shared/types/Common.types';
import { RootState } from '@/store';
import { updateExchangeRatesWithTimestamp } from '@/store/slices/setting.slice';
import { ExchangeRateType } from '@/store/types/setting.type';
import { Currency } from '@prisma/client';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { CACHE_KEY, STALE_TIME } from '../constants/exchangeRates';
import {
  type CurrencyFormatterOptions,
  type ExchangeAmountParams,
  type ExchangeAmountResult,
  type ExchangeRateResponse,
} from '../types';

// Constants for localStorage caching
const apiEndpoint = '/api/setting/currency-setting';

type CachedExchangeRateData = {
  rates: ExchangeRateType;
  updatedAt: number;
  baseCurrency: string;
};

type UseCurrencyFormatterReturn = {
  // Core functions
  formatCurrency: (
    amount: number,
    currency: Currency,
    options?: CurrencyFormatterOptions,
  ) => string;
  exchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult;

  // Data fetching
  mutate: () => Promise<Response<ExchangeRateResponse> | null | undefined>;
  refreshExchangeRates: () => Promise<void>;

  // State
  exchangeRates: ExchangeRateType;
  baseCurrency: Currency;
  selectedCurrency: Currency;
  isLoading: boolean;
  error: any;

  // Utilities
  getSupportedCurrencies: () => Currency[];
  getExchangeRate: (fromCurrency: Currency, toCurrency: Currency) => number | null;
  getCurrencySymbol: (currency: Currency) => string;
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
  } catch (error) {
    console.error('Error reading cached exchange rates:', error);
    return null;
  }
};

/**
 * Helper function to save exchange rate data to localStorage
 */
const setCachedExchangeRates = (data: CachedExchangeRateData): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving exchange rates to cache:', error);
  }
};

/**
 * Helper function to check if cached data is stale (older than 6 hours)
 */
const isCacheStale = (updatedAt: number): boolean => {
  const now = Date.now();
  return now - updatedAt > STALE_TIME;
};

/**
 * Custom hook for currency formatting and exchange rate management
 * Integrates with Redux store and provides comprehensive currency operations
 *
 * @param baseCurrency - Optional base currency for exchange rate calculations
 * @returns Object containing all currency-related functions and state
 */
const useCurrencyFormatter = (baseCurrency?: Currency): UseCurrencyFormatterReturn => {
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
        const formattedRates: ExchangeRateType = {};
        const baseCurrency = response.data.base_code;
        const updatedAt = Date.now();

        // Convert API response to our exchange rate format
        Object.entries(response.data.conversion_rates).forEach(([currency, rate]) => {
          const directKey = `${baseCurrency}_${currency}`;
          formattedRates[directKey] = rate as number;

          if (rate !== 0) {
            const inverseKey = `${currency}_${baseCurrency}`;
            formattedRates[inverseKey] = 1 / (rate as number);
          }
        });

        // Add cross-currency rates
        const rates = response.data.conversion_rates;
        Object.keys(rates).forEach((fromCurrency) => {
          Object.keys(rates).forEach((toCurrency) => {
            if (fromCurrency !== toCurrency && rates[fromCurrency] && rates[toCurrency]) {
              const crossRate = rates[toCurrency] / rates[fromCurrency];
              formattedRates[`${fromCurrency}_${toCurrency}`] = crossRate;
            }
          });
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
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
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
   * Formats a number as currency using FIORA number formatting
   * Automatically fetches exchange rates if not available
   */
  const formatCurrency = useCallback(
    (amount: number, currency: Currency, options: CurrencyFormatterOptions = {}): string => {
      try {
        // Check and ensure exchange rate data is available
        ensureExchangeRateData();

        const { shouldShortened = false, ...formatOptions } = options;

        if (shouldShortened && Math.abs(amount) >= 1000) {
          const currencySymbol = getCurrencySymbol(currency);
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

          const formatted = formatFIORACurrency(formattedValue, currency, formatOptions);

          // Insert suffix appropriately based on currency
          if (currency === 'USD') {
            const numericPart = formatted.replace('$', '').trim();
            return `$${numericPart}${suffix}`;
          } else if (currency === 'VND') {
            const parts = formatted.split('₫').map((part) => part.trim());
            return `${parts[0]}${suffix} ₫${parts[1] || ''}`;
          } else {
            const parts = formatted.split(currencySymbol).map((part) => part.trim());
            return `${parts[0]}${suffix} ${currencySymbol}${parts[1] || ''}`;
          }
        }

        return formatFIORACurrency(amount, currency, formatOptions);
      } catch (error) {
        console.error('Error formatting currency:', error);
        toast.error('Error formatting currency. Please try again.');
        return amount.toString();
      }
    },
    [ensureExchangeRateData],
  );

  /**
   * Gets exchange rate between two currencies
   */
  const getExchangeRate = useCallback(
    (fromCurrency: Currency, toCurrency: Currency): number | null => {
      if (fromCurrency === toCurrency) return 1;

      // Try direct rate
      const directKey = `${fromCurrency}_${toCurrency}`;
      if (exchangeRates[directKey]) {
        return exchangeRates[directKey];
      }

      // Try inverse rate
      const inverseKey = `${toCurrency}_${fromCurrency}`;
      if (exchangeRates[inverseKey]) {
        return 1 / exchangeRates[inverseKey];
      }

      // Try conversion through base currency
      const fromBaseKey = `${effectiveBaseCurrency}_${fromCurrency}`;
      const toBaseKey = `${effectiveBaseCurrency}_${toCurrency}`;

      if (exchangeRates[fromBaseKey] && exchangeRates[toBaseKey]) {
        return exchangeRates[toBaseKey] / exchangeRates[fromBaseKey];
      }

      return null;
    },
    [exchangeRates, effectiveBaseCurrency],
  );

  /**
   * Exchanges amount between currencies with detailed result
   * Automatically fetches exchange rates if not available
   */
  const exchangeAmount = useCallback(
    (params: ExchangeAmountParams): ExchangeAmountResult => {
      const { amount, fromCurrency, toCurrency } = params;

      // Check and ensure exchange rate data is available
      ensureExchangeRateData();

      if (fromCurrency === toCurrency) {
        return {
          convertedAmount: amount,
          originalAmount: amount,
          fromCurrency,
          toCurrency,
          exchangeRate: 1,
          formattedAmount: formatCurrency(amount, toCurrency),
        };
      }

      const rate = getExchangeRate(fromCurrency, toCurrency);

      if (rate === null) {
        toast.warning(
          `Exchange rate not available for ${fromCurrency} to ${toCurrency}. Refreshing rates...`,
        );
        // Trigger refresh for missing rate
        ensureExchangeRateData();

        return {
          convertedAmount: amount,
          originalAmount: amount,
          fromCurrency,
          toCurrency,
          exchangeRate: 1,
          formattedAmount: formatCurrency(amount, toCurrency),
        };
      }

      const convertedAmount = Number((amount * rate).toFixed(2));

      return {
        convertedAmount,
        originalAmount: amount,
        fromCurrency,
        toCurrency,
        exchangeRate: rate,
        formattedAmount: formatCurrency(convertedAmount, toCurrency),
      };
    },
    [formatCurrency, getExchangeRate, ensureExchangeRateData],
  );

  /**
   * Refreshes exchange rates from API and updates store
   * Now includes localStorage caching
   */
  const refreshExchangeRates = useCallback(async (): Promise<void> => {
    try {
      const response = await mutate();

      if (response?.data?.conversion_rates) {
        const formattedRates: ExchangeRateType = {};
        const baseCurrency = response.data.base_code;
        const updatedAt = Date.now();

        // Convert API response to our exchange rate format
        Object.entries(response.data.conversion_rates).forEach(([currency, rate]) => {
          // Direct rate from base currency
          const directKey = `${baseCurrency}_${currency}`;
          formattedRates[directKey] = rate as number;

          // Inverse rate (to base currency)
          if (rate !== 0) {
            const inverseKey = `${currency}_${baseCurrency}`;
            formattedRates[inverseKey] = 1 / (rate as number);
          }
        });

        // Add cross-currency rates for common pairs
        const rates = response.data.conversion_rates;
        Object.keys(rates).forEach((fromCurrency) => {
          Object.keys(rates).forEach((toCurrency) => {
            if (fromCurrency !== toCurrency && rates[fromCurrency] && rates[toCurrency]) {
              const crossRate = rates[toCurrency] / rates[fromCurrency];
              const crossKey = `${fromCurrency}_${toCurrency}`;
              formattedRates[crossKey] = crossRate;
            }
          });
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
      console.error('Failed to refresh exchange rates:', error);
      toast.error('Failed to refresh exchange rates. Please check your connection and try again.');
      throw error; // Re-throw to allow error handling in calling functions
    }
  }, [mutate, dispatch]);

  /**
   * Gets list of supported currencies
   */
  const getSupportedCurrencies = useCallback((): Currency[] => {
    const currencies = new Set<Currency>();

    // Add currencies from exchange rates
    Object.keys(exchangeRates).forEach((key) => {
      const [from, to] = key.split('_');
      if (from) currencies.add(from as Currency);
      if (to) currencies.add(to as Currency);
    });

    // Ensure base currencies are included
    currencies.add('USD');
    currencies.add('VND');
    currencies.add('FX');

    return Array.from(currencies).sort();
  }, [exchangeRates]);

  /**
   * Memoized currency symbol getter
   */
  const getCurrencySymbolMemo = useMemo(() => getCurrencySymbol, []);

  return {
    // Core functions
    formatCurrency,
    exchangeAmount,

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
    getCurrencySymbol: getCurrencySymbolMemo,
  };
};

export default useCurrencyFormatter;
export type {
  CurrencyFormatterOptions,
  ExchangeAmountParams,
  ExchangeAmountResult,
  UseCurrencyFormatterReturn,
};
