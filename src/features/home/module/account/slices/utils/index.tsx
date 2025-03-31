import { Account } from '@/features/home/module/account/slices/types';
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

export const findAccountById = (accounts: Account[] | undefined, id: string): any | null => {
  if (!accounts) return null;
  if (accounts.length === 0) return null;

  for (const account of accounts) {
    if (account.id === id) {
      return account;
    }
    const subAccount = findAccountById(account.children, id);
    if (subAccount) {
      return subAccount;
    }
  }
  return null;
};
