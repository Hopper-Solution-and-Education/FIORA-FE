import { OrderType } from '@/shared/types';

export interface ISavingHistory {
  id: string | number;
  date: Date;
  type: 'Income' | 'Expense' | 'Transfer' | string;
  amount: number;
  from: string;
  to: string;
  remark: string;
  currency?: string;
  description?: string;
}

export type SavingColumn =
  | 'No.'
  | 'Date'
  | 'Type'
  | 'Amount'
  | 'From'
  | 'To'
  | 'Remark'
  | 'Actions';

export type SavingTableColumn = {
  col: SavingColumn;
  sortable: boolean;
  sortedBy?: OrderType;
};

export type SavingTableColumnKey = { [key in SavingColumn]: SavingTableColumn };

export enum TransactionType {
  Expense = 'Expense',
  Income = 'Income',
  Transfer = 'Transfer',
}

export type PackageFX = {
  id: string;
  fxAmount: number;
};

export interface ISavingWallet {
  id: string;
  name: string;
  type: string;
}

export type SavingFilterOptionResponse = {
  categories: string[];
  wallets: string[];
  amountMin: number;
  amountMax: number;
};
