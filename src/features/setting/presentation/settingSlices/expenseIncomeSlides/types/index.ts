export enum CategoryTypeEnum {
  EXPENSE = 'Expense',
  INCOME = 'Income',
}

export interface Category {
  id: string;
  name: string;
  type: CategoryTypeEnum;
  subCategories: Category[];
  description?: string;
  icon?: string;
  parentId?: string | null;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
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
}
