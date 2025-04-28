import { BudgetType, BudgetsTable } from '@prisma/client';
import { BudgetSummary } from '../../domain/entities/BudgetSummary';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';

export interface IBudgetSummaryRepository {
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummary>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType>;
  getBudgetsByUserIdAndFiscalYear(userId: string, fiscalYear: number): Promise<BudgetsTable[]>;
}
