import { BudgetDetailType } from '@prisma/client';

export interface BudgetDetailCategoryCreationParams {
  userId: string;
  fiscalYear: string;
  categoryId: string;
  type: BudgetDetailType;
  bottomUpPlan: Record<string, number>;
  actualSumUpPlan: Record<string, number>;
  currency: string;
}

export type BudgetDetailCategoryUpdateParams = Omit<
  BudgetDetailCategoryCreationParams,
  'actualSumUpPlan'
>;

export type BudgetDetailCategoryDeleteParams = Pick<
  BudgetDetailCategoryUpdateParams,
  'userId' | 'categoryId' | 'fiscalYear' | 'type'
> & { isTruncate?: boolean };

export type MonthlyBudgetDetailValues = { bottomUp: number; actual: number }[];
