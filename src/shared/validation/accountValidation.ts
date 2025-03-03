import { AccountType } from '@prisma/client';

export const ACCOUNT_TYPE_RULES = {
  [AccountType.Payment]: { minBalance: 0, allowNegative: false },
  [AccountType.Saving]: { minBalance: 0, allowNegative: false },
  [AccountType.CreditCard]: { minBalance: 0, allowNegative: true, hasLimit: true }, // Balance can be negative up to credit limit
  [AccountType.Debt]: { minBalance: 0, allowNegative: true }, // Balance must be negative or zero
  [AccountType.Lending]: { minBalance: 0, allowNegative: false },
};

export const validateAccount = (accountType: AccountType, balance: number, limit?: number) => {
  // switch (type) {
  //   case AccountType.Payment:
  //   case AccountType.Saving:
  //   case AccountType.Lending:
  //     if (balance < 0) {
  //       throw new InternalServerError(`${type} account balance must be >= 0`);
  //     }
  //     break;
  //   case AccountType.CreditCard:
  //     if (!limit) {
  //       throw new InternalServerError('Credit Card must have a credit limit');
  //     }
  //     if (balance > 0) {
  //       throw new InternalServerError('Credit Card balance must be <= 0');
  //     }
  //     if (balance < -limit) {
  //       throw new InternalServerError('Credit Card balance cannot be lower than credit limit');
  //     }
  //     break;
  //   case 'Debt':
  //     if (balance > 0) {
  //       throw new InternalServerError('Debt account balance must be <= 0');
  //     }
  //     break;
  //   default:
  //     throw new InternalServerError('Invalid account type');
  // }
  // return true;

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
