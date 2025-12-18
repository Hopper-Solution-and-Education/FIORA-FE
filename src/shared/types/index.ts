export * from './budget.types';
export * from './budgetDetail.types';
export * from './category.types';
export * from './chart.types';
export * from './common.types';
export * from './exchangeRate.types';
export * from './filter.types';
export * from './formsheet.type';
export * from './globalNav.types';
export * from './httpResponse.types';
export * from './membershipBenefit.types';
export * from './notification.types';
export * from './otp.types';
export * from './partner.types';
export * from './product.types';
export * from './session.types';
export * from './transaction.types';

export type Currency = 'VND' | 'USD' | 'FX';

export type CreatedBy = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export type UpdatedBy = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export enum OPERAND {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '*',
  DIVIDE = '/',
}
