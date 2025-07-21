import { Prisma } from '@prisma/client';

export interface TransactionFilters {
  date?: Date | { from?: Date; to?: Date }; // Support exact date or range
  type?: TransactionType | TransactionType[]; // Support single or multiple types
  fromAccount?: string; // From account name
  toAccount?: string; // To account name
  partner?: string; // Partner name
  amount?: number | { from?: number; to?: number }; // Support exact amount or range
}

export interface TransactionType {
  id: string;
  userId: string | null;
  type: string;
  amount: number;
  currency: string;
  baseCurrency: string;
  baseAmount: number;
}

export interface TransactionGetPagination {
  page: number;
  pageSize: number;
  filters?: any;
  sortBy?: Record<string, any>;
  searchParams?: string;
  userId: string;
}

export interface Filter {
  [key: string]: any;
}

export type TransactionGetPaginate = Prisma.TransactionGetPayload<{
  include: {
    fromAccount: true;
    fromCategory: true;
    toAccount: true;
    toCategory: true;
    partner: true;
  };
}>;

export type DropdownOption = { value: string; label: string; disabled?: boolean; icon?: string };
