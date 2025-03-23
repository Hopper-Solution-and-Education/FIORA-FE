import { COLORS } from '@/shared/constants/chart';

export function getAccountColorByType(type: string) {
  switch (type) {
    case 'Payment':
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case 'Saving':
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case 'Lending':
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case 'Investment':
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case 'CreditCard':
      return COLORS.DEPS_DANGER.LEVEL_1;
    case 'Debt':
      return COLORS.DEPS_DANGER.LEVEL_1;
    default:
      return COLORS.DEPS_DANGER.LEVEL_1;
  }
}
