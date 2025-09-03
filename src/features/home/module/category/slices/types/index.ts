import { FilterCriteria } from '@/shared/types';
import { CategoryType } from '@prisma/client';

export interface RawCategory {
  id: string;
  userId?: string;
  type: CategoryType;
  icon: string;
  tax_rate: number;
  balance: number;
  name: string;
  description?: string;
  parentId?: string | null;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;

  fromTransactions?: CategoryTransaction[];
  toTransactions?: CategoryTransaction[];
}

export type CategoryFilterResponse = {
  data: RawCategory[];
  minBalance?: number;
  maxBalance?: number;
  minAmount?: number;
  maxAmount?: number;
};

export type CategoryTransaction = {
  amount: number;
  currency: string;
  baseAmount: number;
  baseCurrency: string;
  isDeleted: boolean;
};

export interface Category {
  id: string;
  userId?: string;
  type: CategoryType;
  icon: string;
  tax_rate: number;
  balance: number;
  name: string;
  description?: string;
  parentId?: string | null;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;

  subCategories: Category[];

  fromTransactions: CategoryTransaction[];
  toTransactions: CategoryTransaction[];
}

export interface CategoryState {
  categories: {
    isLoading: boolean;
    data: Category[] | undefined;
    error: string | null;
    message?: string;
  };
  selectedCategory: Category | null;
  dialogOpen: boolean;
  updateDialogOpen: boolean;
  deleteConfirmOpen: boolean;
  filterCriteria: FilterCriteria;
  minBalance: number;
  maxBalance: number;
}

export const initialCategoryState: CategoryState = {
  categories: {
    isLoading: false,
    data: undefined,
    error: null,
  },
  selectedCategory: null,
  dialogOpen: false,
  updateDialogOpen: false,
  deleteConfirmOpen: false,
  filterCriteria: {
    userId: '',
    filters: {},
  },
  minBalance: 0,
  maxBalance: 0,
};
