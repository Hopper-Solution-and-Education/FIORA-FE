import { Account } from '@/features/home/module/account/slices/types';

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
