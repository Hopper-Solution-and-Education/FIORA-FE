import { BudgetDetailType, Currency } from '@prisma/client';

export interface BudgetDetailCategoryCreationParams {
  userId: string;
  fiscalYear: string;
  categoryId: string;
  type: BudgetDetailType;
  bottomUpPlan: Record<string, number>;
  actualSumUpPlan: Record<string, number>;
  currency: Currency;
}

export type BudgetDetailCategoryUpdateParams = Omit<
  BudgetDetailCategoryCreationParams,
  'actualSumUpPlan'
>;

export type BudgetDetailCategoryDeleteParams = Pick<
  BudgetDetailCategoryUpdateParams,
  'userId' | 'categoryId' | 'fiscalYear' | 'type'
>;

export type MonthlyBudgetDetailValues = { bottomUp: number; actual: number }[];
