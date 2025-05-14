import { COLORS } from '@/shared/constants/chart';
import { formatCurrency } from '@/shared/utils';

export const generateColor = (balance: number, isChild: boolean) => {
  if (balance > 0) {
    return isChild ? COLORS.DEPS_SUCCESS.LEVEL_3 : COLORS.DEPS_SUCCESS.LEVEL_2;
  } else {
    return isChild ? COLORS.DEPS_DANGER.LEVEL_3 : COLORS.DEPS_DANGER.LEVEL_2;
  }
};

export const formatter = (key: string, value: number, currency: string): string => {
  return `${key}: ${formatCurrency(value, currency)}`;
};
