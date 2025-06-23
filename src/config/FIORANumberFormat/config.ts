import { SYMBOL_POSITION } from './constant';
import { FIORACurrencyConfig } from './type';

export const FIORA_CURRENCY_CONFIG: FIORACurrencyConfig = {
  FX: {
    symbol: 'FX',
    name: 'FIORA',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: SYMBOL_POSITION.AFTER,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: SYMBOL_POSITION.BEFORE,
    thousandSeparator: ',',
    decimalSeparator: '.',
  },
  VND: {
    symbol: '₫',
    name: 'Vietnamese Dong',
    locale: 'vi-VN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    position: SYMBOL_POSITION.AFTER,
    thousandSeparator: '.',
    decimalSeparator: ',',
  },
} as const;
