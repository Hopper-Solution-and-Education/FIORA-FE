import { Account } from '@/features/home/module/account/slices/types';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { COLORS } from '@/shared/constants/chart';

export function getAccountColorByType(type: string) {
  switch (type) {
    case ACCOUNT_TYPES.PAYMENT:
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case ACCOUNT_TYPES.SAVING:
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case ACCOUNT_TYPES.LENDING:
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case ACCOUNT_TYPES.INVEST:
      return COLORS.DEPS_SUCCESS.LEVEL_1;
    case ACCOUNT_TYPES.CREDIT_CARD:
      return COLORS.DEPS_DANGER.LEVEL_1;
    case ACCOUNT_TYPES.DEBT:
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
