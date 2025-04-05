import { Transaction } from '@prisma/client';

export type OrderType = 'asc' | 'desc' | 'none';

export type DropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
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
  createdBy: string;
  updatedBy: string | null;
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

export type TransactionFilterComparator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt' //greater than
  | 'gte' //greater than or equal to
  | 'lt' //less than
  | 'lte' //less than or equal to
  | 'some' // for array
  | 'every'; // for array

export type TransactionFilterOperator = 'AND' | 'OR';

export type PrimitiveType = string | number | boolean | Date | null;

export type TransactionFilterObject = {
  [key: string | TransactionFilterComparator | TransactionFilterOperator]:
    | PrimitiveType
    | TransactionFilterComparator
    | TransactionFilterObject;
};

export type TransactionFilterCriteria = {
  filters?: TransactionFilterObject;
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
  fromAccounts: string[];
  toAccounts: string[];
  fromCategories: string[];
  toCategories: string[];
  partners: string[];
};

export type PaginationProps = {
  page: number;
  pageSize: number;
};
