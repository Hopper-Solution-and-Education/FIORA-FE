'use client';

import { Category } from '@/features/home/module/budgets/summary-detail/data/dto/response/CategoryResponseDTO';
import { TableData } from '@/features/home/module/budgets/summary-detail/presentation/types/table.type';

export interface BudgetDetailStateType {
  // Table data state
  tableData: TableData[];

  // Category data state
  categoryList: Category[];
}

export const keyBudgetDetailState = 'budgetDetail';

const initialBudgetDetailState: BudgetDetailStateType = {
  // Table data
  tableData: [],

  // Category data
  categoryList: [],
};

export { initialBudgetDetailState };
