import { BudgetType } from '@prisma/client';
import { BudgetSummaryResponse } from './BudgetSummaryUsecase';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';

export interface IBudgetSummaryUseCase {
  getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponse>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null>;
}
