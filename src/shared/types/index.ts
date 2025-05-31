export * from './Common.types';
export * from './GlobalNav.types';
export * from './category.types';
export * from './formsheet.type';
export * from './product.types';
export * from './transaction.types';
export * from './filter.types';
export * from './httpResponse.types';

export type Currency = 'VND' | 'USD';

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
