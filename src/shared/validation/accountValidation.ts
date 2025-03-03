import { InternalServerError } from '@/lib/errors';
import { AccountType } from '@prisma/client';

export const validateAccount = (type: AccountType, balance: number, limit?: number) => {
  switch (type) {
    case AccountType.Payment:
    case AccountType.Saving:
    case AccountType.Lending:
      if (balance < 0) {
        throw new InternalServerError(`${type} account balance must be >= 0`);
      }
      break;
    case AccountType.CreditCard:
      if (!limit) {
        throw new InternalServerError('Credit Card must have a credit limit');
      }
      if (balance > 0) {
        throw new InternalServerError('Credit Card balance must be <= 0');
      }
      if (balance < -limit) {
        throw new InternalServerError('Credit Card balance cannot be lower than credit limit');
      }
      break;
    case 'Debt':
      if (balance > 0) {
        throw new InternalServerError('Debt account balance must be <= 0');
      }
      break;
    default:
      throw new InternalServerError('Invalid account type');
  }
  return true;
};
