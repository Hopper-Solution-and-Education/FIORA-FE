import { formatFIORACurrency, getCurrencySymbol } from '@/config/FIORANumberFormat';
import useDataFetcher from '@/shared/hooks/useDataFetcher';
import { Response } from '@/shared/types/Common.types';
import { RootState } from '@/store';
import { updateExchangeRates } from '@/store/slices/setting.slice';
import { ExchangeRateType } from '@/store/types/setting.type';
import { Currency } from '@prisma/client';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Types for the hook - matching your actual API structure
interface ExchangeRateApiResponse {
  time_last_update_unix: number;
  time_last_update_utc: string;
  base_code: string;
  conversion_rates: {
    [currencyCode: string]: number;
  };
}

interface CurrencyFormatterOptions {
  shouldShortened?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

interface ExchangeAmountParams {
  amount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
}

interface ExchangeAmountResult {
  convertedAmount: number;
  originalAmount: number;
  fromCurrency: Currency;
  toCurrency: Currency;
  exchangeRate: number;
  formattedAmount: string;
}

interface UseCurrencyFormatterReturn {
  // Core functions
  formatCurrency: (
    amount: number,
    currency: Currency,
    options?: CurrencyFormatterOptions,
  ) => string;
  exchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult;

  // Data fetching
  mutate: () => Promise<Response<ExchangeRateApiResponse> | null | undefined>;
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
}

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
  } = useSelector((state: RootState) => state.settings);

  const effectiveBaseCurrency = baseCurrency || storeBaseCurrency;

  // Use existing API endpoint for exchange rates
  const apiEndpoint = '/api/setting/currency-setting';

  // Data fetching with useDataFetcher
  const { isLoading, error, mutate } = useDataFetcher<ExchangeRateApiResponse>({
    endpoint: apiEndpoint,
    method: 'GET',
  });

  /**
   * Checks if exchange rate data is valid and triggers refresh if needed
   */
  const ensureExchangeRateData = useCallback(async (): Promise<boolean> => {
    // Check if we have any exchange rate data
    if (Object.keys(exchangeRates).length === 0) {
      console.log('No exchange rate data found, fetching from API...');
      try {
        // Call mutate directly to avoid circular dependency
        const response = await mutate();

        if (response?.data?.conversion_rates) {
          const formattedRates: ExchangeRateType = {};
          const baseCurrency = response.data.base_code;

          // Convert API response to our exchange rate format
          Object.entries(response.data.conversion_rates).forEach(([currency, rate]) => {
            const directKey = `${baseCurrency}_${currency}`;
            formattedRates[directKey] = rate;

            if (rate !== 0) {
              const inverseKey = `${currency}_${baseCurrency}`;
              formattedRates[inverseKey] = 1 / rate;
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

          // Update Redux store
          dispatch(updateExchangeRates(formattedRates));
          console.log('Exchange rates loaded successfully');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        return false;
      }
    }
    return true;
  }, [exchangeRates, mutate, dispatch]);

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
        console.warn(
          `No exchange rate available for ${fromCurrency} to ${toCurrency}, triggering data refresh...`,
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
   */
  const refreshExchangeRates = useCallback(async (): Promise<void> => {
    try {
      console.log('Fetching exchange rates from API...');
      const response = await mutate();

      if (response?.data?.conversion_rates) {
        const formattedRates: ExchangeRateType = {};
        const baseCurrency = response.data.base_code;

        // Convert API response to our exchange rate format
        Object.entries(response.data.conversion_rates).forEach(([currency, rate]) => {
          // Direct rate from base currency
          const directKey = `${baseCurrency}_${currency}`;
          formattedRates[directKey] = rate;

          // Inverse rate (to base currency)
          if (rate !== 0) {
            const inverseKey = `${currency}_${baseCurrency}`;
            formattedRates[inverseKey] = 1 / rate;
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

        // Update Redux store
        dispatch(updateExchangeRates(formattedRates));

        console.log('Exchange rates updated successfully:', {
          baseCurrency,
          ratesCount: Object.keys(formattedRates).length,
          lastUpdate: response.data.time_last_update_utc,
        });
      } else {
        console.warn('No conversion rates found in API response');
      }
    } catch (error) {
      console.error('Failed to refresh exchange rates:', error);
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
