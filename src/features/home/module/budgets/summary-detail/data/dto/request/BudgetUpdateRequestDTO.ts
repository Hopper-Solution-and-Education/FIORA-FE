import { DataSourceItemProps } from '@/components/common/tables/custom-table/types';

export interface MonthlyPlanningData {
  [key: `m${number}_${'exp' | 'inc'}`]: DataSourceItemProps | number;
}

export interface TopDownUpdateRequestDTO {
  fiscalYear: string;
  type: 'Expense' | 'Income';
  updateTopBudget: MonthlyPlanningData;
}

export interface CategoryPlanningUpdateRequestDTO {
  fiscalYear: string;
  type: 'Expense' | 'Income';
  categoryId: string;
  bottomUpPlan: MonthlyPlanningData;
  actualSumUpPlan: MonthlyPlanningData;
}

export interface DeleteCategoryRequestDTO {
  fiscalYear: string;
  type: string;
  categoryId: string;
  isTruncate?: boolean;
}
