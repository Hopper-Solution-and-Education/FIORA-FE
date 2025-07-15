import { CURRENCY } from '@/shared/constants';
import { SYMBOL_POSITION } from './constant';
import { FIORACurrencyConfig } from './type';

export const FIORA_CURRENCY_CONFIG: FIORACurrencyConfig = {
  [CURRENCY.FX]: {
    symbol: 'FX',
    name: 'FIORA',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: SYMBOL_POSITION.AFTER,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  [CURRENCY.USD]: {
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: SYMBOL_POSITION.BEFORE,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  [CURRENCY.VND]: {
    symbol: '₫',
    name: 'Vietnamese Dong',
    locale: 'vi-VN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    position: SYMBOL_POSITION.AFTER,
    thousandSeparator: '.',
    decimalSeparator: ',',
  },
} as const;
