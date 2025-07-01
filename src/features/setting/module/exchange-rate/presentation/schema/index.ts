import { z } from 'zod';
import { ExchangeRateType } from '../types';

// Create validation schema
export const createExchangeRateSchema = (
  existingRates: ExchangeRateType[] = [],
  currentRateId?: string,
) => {
  return z.object({
    fromCurrency: z.literal('USD', {
      errorMap: () => ({ message: 'From currency must be USD' }),
    }),
    fromSymbol: z.literal('$', {
      errorMap: () => ({ message: 'From symbol must be $' }),
    }),
    fromValue: z.literal(1, {
      errorMap: () => ({ message: 'From value must be 1' }),
    }),
    toCurrency: z
      .string()
      .trim()
      .min(1, 'To currency is required')
      .max(5, 'To currency must be at most 5 characters')
      .refine((value) => value !== 'USD', {
        message: 'To currency cannot be the same as from currency (USD)',
      })
      .refine(
        (value) => {
          // Check for duplicates, excluding current rate when updating
          const duplicateRate = existingRates.find(
            (rate) => rate.toCurrency === value && rate.id !== currentRateId,
          );
          return !duplicateRate;
        },
        {
          message: 'Currency already exists',
        },
      ),
    toSymbol: z
      .string()
      .trim()
      .min(1, 'To symbol is required')
      .max(5, 'To symbol must be at most 5 characters')
      .refine((value) => value !== '$', {
        message: 'To symbol cannot be the same as from symbol ($)',
      })
      .refine(
        (value) => {
          // Check for duplicates, excluding current rate when updating
          const duplicateRate = existingRates.find(
            (rate) => rate.toSymbol === value && rate.id !== currentRateId,
          );
          return !duplicateRate;
        },
        {
          message: 'Symbol already exists',
        },
      ),
    toValue: z
      .number({
        required_error: 'To value is required',
        invalid_type_error: 'To value must be a number',
      })
      .positive('To value must be positive')
      .refine(
        (value) => {
          // Check if the number has more than 9 decimal places
          const decimalPlaces = (value.toString().split('.')[1] || '').length;
          return decimalPlaces <= 9;
        },
        {
          message: 'To value can have at most 9 decimal places',
        },
      ),
  });
};

export type ExchangeRateFormData = z.infer<ReturnType<typeof createExchangeRateSchema>>;
