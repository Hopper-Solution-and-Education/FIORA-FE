import { formatFIORACurrency } from '@/config/FIORANumberFormat';
import { Currency } from '@/shared/types';

export const formatCurrency = (value: number, currency: Currency = 'VND') =>
  formatFIORACurrency(value, currency);
