export enum CategoryTypeEnum {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
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
