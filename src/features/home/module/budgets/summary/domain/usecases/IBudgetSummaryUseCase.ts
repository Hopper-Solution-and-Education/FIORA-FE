import { BudgetType } from '../entities/BudgetType';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';
import { BudgetSummaryResponseDTO } from '../../data/dto/response/BudgetSummaryResponseDTO';

export interface IBudgetSummaryUseCase {
  getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponseDTO>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null>;
}
