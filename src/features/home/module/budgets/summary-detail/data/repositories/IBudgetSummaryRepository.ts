import { BudgetSummary } from '../../domain/entities/BudgetSummary';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import { Budget } from '../../domain/entities/Budget';
import { BudgetType } from '../../domain/entities/BudgetType';

export interface IBudgetSummaryRepository {
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummary>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType>;
  getBudgetsByUserIdAndFiscalYear(userId: string, fiscalYear: number): Promise<Budget[]>;
  getCategoriesByType(type: 'Income' | 'Expense'): Promise<any[]>;
  getActualPlanningByCategory(categoryId: string, year: number): Promise<any>;
}
