import { Transaction } from '@prisma/client';

export type OrderType = 'asc' | 'desc' | 'none';

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
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
  fromAccount?: TransactionAccount | null;
  fromCategory?: TransactionCategory | null;
  toAccount?: TransactionAccount | null;
  toCategory?: TransactionCategory | null;
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

export type TransactionFilterCriteria = {
  filters?: any;
  sortBy?: {
    [key: string]: OrderType;
  };
  userId: string;
  search?: string;
};

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
};

export type TransactionFilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'some'
  | 'every';

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
