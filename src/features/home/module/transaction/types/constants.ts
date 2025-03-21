export const TRANSACTION_TYPE: { [key: string]: string } = {
  EXPENSE: 'red-500',
  TRANSFER: 'black',
  INCOME: 'green-600',
};

export enum TransactionCurrency {
  USD = 'USD',
  VND = 'VND',
}

export enum TransactionRecurringType {
  NONE = '',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}
