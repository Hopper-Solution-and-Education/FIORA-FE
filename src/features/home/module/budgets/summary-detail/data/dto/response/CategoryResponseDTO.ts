export interface BudgetDetail {
  id: string;
  userId: string;
  budgetId: string;
  type: string;
  categoryId: string;
  month: number;
  amount: number;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  icon: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  budgetDetails?: BudgetDetail[];
}

export interface CategoryResponseDTO {
  code: number;
  message: string;
  data: Category[];
}

export interface CategoryPlanningData {
  [key: string]: number | string;
}

export interface CategoryPlanning {
  bottomUp: CategoryPlanningData;
  actual: CategoryPlanningData;
}

export interface CategoryPlanningResponseDTO {
  code: number;
  message: string;
  data: CategoryPlanning;
}
