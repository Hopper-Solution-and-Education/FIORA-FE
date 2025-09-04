import { OrderType } from '@/shared/types';

export type Transaction = {
  id: string;
  userId: string | null;
  date: Date;
  type: 'Expense' | 'Income' | 'Transfer';
  amount: number;
  fromAccountId: string | null;
  fromCategoryId: string | null;
  toAccountId: string | null;
  toCategoryId: string | null;
  products: any;
  partnerId: string | null;
  remark: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string | null;
  createdBy: string | null;
  currencyId: string | null;
  isMarked: boolean;
  isExpired: boolean;
  currency: string | null;
  fromWalletId: string | null;
  toWalletId: string | null;
  membershipBenefitId: string | null;
  baseCurrency: string | null;
  baseAmount: string | null;
};

export type TransactionPartner = {
  id: string;
  userId: string;
  logo: string | null;
  name: string;
  identify: string;
  dob: Date | null;
  taxNo: string | null;
  address: string;
  email: string;
  phone: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string | null;
  parentId: string | null;
  type?: string;
};

export type TransactionAccount = {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string | null;
  type: string;
  currency: string;
  limit: string;
  balance: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string | null;
  color: string | null;
};

export type TransactionCategory = {
  id: string;
  userId: string;
  type: string;
  icon: string;
  name: string;
  description: string | null;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  balance: string;
  tax_rate: string | null;
};

export type TransactionWallet = {
  id: string;
  userId: string;
  icon: string;
  type: string;
  frBalanceActive: string;
  frBalanceFrozen: string;
  creditLimit: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  name: string | null;
};

export type TransactionSubjectStamp = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

export interface IRelationalTransaction extends Transaction {
  fromAccountId: string | null;
  fromCategoryId: string | null;
  toAccountId: string | null;
  toCategoryId: string | null;
  partnerId: string | null;
  remark: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: any;
  updatedBy: any;
  currencyId: string | null;
  isMarked: boolean;
  isExpired: boolean;
  currency: string | null;
  fromWalletId: string | null;
  toWalletId: string | null;
  membershipBenefitId: string | null;
  baseCurrency: string | null;
  baseAmount: string | null;
  fromAccount?: TransactionAccount | null;
  fromCategory?: TransactionCategory | null;
  toAccount?: TransactionAccount | null;
  toCategory?: TransactionCategory | null;
  toWallet?: TransactionWallet | null;
  partner?: TransactionPartner | null;
}

export type TransactionTableColumn = {
  index: number;
  sortable: boolean;
  sortedBy?: OrderType;
};

export type TransactionColumn =
  | 'No.'
  | 'Date'
  | 'Type'
  | 'Amount'
  | 'From'
  | 'To'
  | 'Partner'
  | 'Actions';

export type TransactionTableColumnKey = { [key in TransactionColumn]: TransactionTableColumn };

export type ITransactionPaginatedResponse = {
  data: Transaction[];
  amountMin: number;
  amountMax: number;
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
};

export type TransactionFilterOptionResponse = {
  accounts: string[];
  categories: string[];
  partners: string[];
  wallets: string[];
  amountMin: number;
  amountMax: number;
};

export type PaginationProps = {
  page: number;
  pageSize: number;
};

export type CreateTransactionBody = {
  fromAccountId: string | null;
  fromCategoryId: string | null;
  toCategoryId: string | null;
  toAccountId: string | null;
  amount: string | number;
  products?: { id: string }[];
  partnerId: string | null;
  remark: string | null;
  date: string | Date;
  type: string;
  currency: string;
};

export enum TransactionType {
  Expense = 'Expense',
  Income = 'Income',
  Transfer = 'Transfer',
}

export * from './getSupportDataResponse';
