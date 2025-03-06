export enum CategoryTypeEnum {
  EXPENSE = 'Expense',
  INCOME = 'Income',
}
export interface RawCategory {
  id: string;
  userId: string;
  type: CategoryTypeEnum;
  icon: string;
  name: string;
  description: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
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
