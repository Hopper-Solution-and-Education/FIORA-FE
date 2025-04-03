import { TransactionCurrency } from '../utils/constants';

export const formatCurrency = (num: number, currency: TransactionCurrency): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
  });
};
