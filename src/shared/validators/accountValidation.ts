import { AccountType } from '@prisma/client';

export const ACCOUNT_TYPE_RULES = {
  [AccountType.Payment]: { minBalance: 0, allowNegative: false },
  [AccountType.Saving]: { minBalance: 0, allowNegative: false },
  [AccountType.CreditCard]: { minBalance: 0, allowNegative: true, hasLimit: true }, // Balance can be negative up to credit limit
  [AccountType.Debt]: { minBalance: 0, allowNegative: true }, // Balance must be negative or zero
  [AccountType.Invest]: { minBalance: 0, allowNegative: false },
  [AccountType.Lending]: { minBalance: 0, allowNegative: false },
};

export const validateAccount = (accountType: AccountType, balance: number, limit?: number) => {

  const rules = ACCOUNT_TYPE_RULES[accountType];

  if (balance < rules.minBalance && !rules.allowNegative) {
    return false;
  }

  if (accountType === AccountType.CreditCard && limit !== undefined) {
    if (balance < -limit) {
      return false;
    }
  }

  if (accountType === AccountType.Debt && balance > 0) {
    return false;
  }

  return true;
};
