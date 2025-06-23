import { Currency } from '@/shared/types';
import { SYMBOL_POSITION } from './constant';

export type FIORACurrencyConfig = {
  [key in Currency]: {
    symbol: string;
    name: string;
    locale: string;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
    position: SymbolPosition;
    thousandSeparator: string;
    decimalSeparator: string;
  };
};

export type SymbolPosition = (typeof SYMBOL_POSITION)[keyof typeof SYMBOL_POSITION];
