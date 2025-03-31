import { DropdownOption, TransactionFilterCriteria, TransactionTableColumnKey } from '../types';

export const TRANSACTION_TYPE: { [key: string]: string } = {
  EXPENSE: 'red-500',
  TRANSFER: 'blue-600',
  INCOME: 'green-600',
};

export const MOCK_ACCOUNTS: DropdownOption[] = [
  { label: 'Account A', value: '1' },
  { label: 'Account B', value: '2' },
  { label: 'Account C', value: '3' },
  { label: 'Account D', value: '4' },
  { label: 'Account E', value: '5' },
  { label: 'Account F', value: '6' },
  { label: 'Account G', value: '7' },
  { label: 'Account H', value: '8' },
  { label: 'Account I', value: '9' },
  { label: 'Account J', value: '10' },
  { label: 'Account K', value: '11' },
];

export const MOCK_CATEORIES: DropdownOption[] = [
  { label: 'Category A', value: '1' },
  { label: 'Category B', value: '2' },
  { label: 'Category C', value: '3' },
  { label: 'Category D', value: '4' },
  { label: 'Category E', value: '5' },
  { label: 'Category F', value: '6' },
  { label: 'Category G', value: '7' },
  { label: 'Category H', value: '8' },
  { label: 'Category I', value: '9' },
  { label: 'Category J', value: '10' },
  { label: 'Category K', value: '11' },
];

export const MOCK_PRODUCTS: DropdownOption[] = [
  { label: 'Product A', value: '1' },
  { label: 'Product B', value: '2' },
  { label: 'Product C', value: '3' },
  { label: 'Product D', value: '4' },
  { label: 'Product E', value: '5' },
  { label: 'Product F', value: '6' },
  { label: 'Product G', value: '7' },
  { label: 'Product H', value: '8' },
  { label: 'Product I', value: '9' },
  { label: 'Product J', value: '10' },
  { label: 'Product K', value: '11' },
];

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
  filters: {},
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
