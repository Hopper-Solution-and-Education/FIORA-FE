import { TransactionFilterCriteria, TransactionTableColumnKey } from '../types';

export const TRANSACTION_TYPE: { [key: string]: string } = {
  EXPENSE: 'red-500',
  TRANSFER: 'blue-600',
  INCOME: 'green-600',
};

export const DEFAULT_TRANSACTION_TABLE_COLUMNS: TransactionTableColumnKey = {
  //True = sortable, False = not sortable
  'No.': { sortable: false, index: 1, sortedBy: 'none' },
  Date: { sortable: true, index: 2, sortedBy: 'none' },
  Type: { sortable: true, index: 3, sortedBy: 'none' },
  Amount: { sortable: true, index: 4, sortedBy: 'none' },
  From: { sortable: true, index: 5, sortedBy: 'none' },
  To: { sortable: true, index: 6, sortedBy: 'none' },
  Partner: { sortable: true, index: 7, sortedBy: 'none' },
  Actions: { sortable: false, index: 8, sortedBy: 'none' },
};

export const DEFAULT_TRANSACTION_FILTER_CRITERIA: TransactionFilterCriteria = {
  userId: '',
  filters: {
    isDeleted: false,
  },
};

export enum TransactionCurrency {
  USD = 'USD',
  VND = 'VND',
}

export enum TransactionRecurringType {
  NONE = 'None',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

export enum TransactionTableToEntity {
  'No.' = 'no',
  Date = 'date',
  Type = 'type',
  Amount = 'amount',
  From = 'fromAccount',
  To = 'toAccount',
  Partner = 'partnerId',
  Actions = 'actions',
}
