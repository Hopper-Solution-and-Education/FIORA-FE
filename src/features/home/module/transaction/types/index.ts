export type OrderType = 'asc' | 'desc' | 'none';

export const TRANSACTION_TYPE: { [key: string]: string } = {
  EXPENSE: 'red',
  TRANSFER: 'blue',
  INCOME: '#16a34a',
};

export type Transaction = {
  date: string;
  type: string;
  amount: string;
  from: string;
  to: string;
  partner: string;
};
