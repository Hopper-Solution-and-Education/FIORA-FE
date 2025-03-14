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
}

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
}

export interface ExpenseIncomeState {
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
}

export const initialExpenseIncomeState: ExpenseIncomeState = {
  categories: {
    isLoading: false,
    data: undefined,
    error: null,
  },
  selectedCategory: null,
  dialogOpen: false,
  updateDialogOpen: false,
  deleteConfirmOpen: false,
};

export interface Account {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string;
  type: string;
  currency: string;
  limit: string;
  balance: string;
  parentId: string | null;
}

export interface CreateAccountModalProps {
  isOpen: boolean;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setTriggered: (isTriggered: boolean) => void;
  isTriggered: boolean;
}
