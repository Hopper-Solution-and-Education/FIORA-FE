import { FilterCriteria } from '@/shared/types';

export type SavingType = 'Income' | 'Expense' | 'Transfer';

export type SavingWallet = {
  id: string;
  type: SavingType;
  balance: number;
  availableReward: number;
  claimsedReward: number;
  accumReward: number;
};

export type SavingBenefit = {
  slug: string;
  name: string;
  suffix: string;
  description: string;
  value: number;
};

export type SavingWalletOverview = {
  wallet: SavingWallet;
  moveInBalance: number;
  moveOutBalance: number;
  benefit: SavingBenefit;
};

export interface IWallet {
  id: string;
  icon: string | null;
  type: string;
  frBalanceActive: number;
  frBalanceFrozen: number;
  creditLimit: null;
  createdAt: Date;
  name: string | null;
  accumulatedEarn: number;
  accumReward: number;
  availableReward: number;
  claimsedReward: number;
}

export interface ISavingHistory {
  id: string | number;
  date: Date;
  type: SavingType | string;
  amount: number;
  fromWalletId: string;
  toWalletId: string;
  remark: string;
  isDeleted: false;
  createdAt: Date;
  currencyId: string;
  currency: string;
  baseCurrency: string;
  baseAmount: number;
  membershipBenefitId: string;
  fromWallet: IWallet | null;
  toWallet: IWallet | null;
  membershipBenefit: SavingBenefit;
}

export interface ISavingTransactionHistory {
  data: ISavingHistory[];
  totalPage?: number;
  page?: number;
  pageSize?: number;
  amountMax?: number;
  amountMin?: number;
  total?: number;
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

export interface ISavingTransactionFilter extends FilterCriteria {
  page?: number;
  pageSize?: number;
}
