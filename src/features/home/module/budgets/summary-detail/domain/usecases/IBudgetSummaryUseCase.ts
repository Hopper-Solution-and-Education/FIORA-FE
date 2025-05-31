import { BudgetType } from '../entities/BudgetType';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';
import { BudgetSummaryResponseDTO } from '../../data/dto/response/BudgetSummaryResponseDTO';
import { Category, CategoryPlanning } from '../../data/dto/response/CategoryResponseDTO';
import {
  TopDownUpdateRequestDTO,
  CategoryPlanningUpdateRequestDTO,
} from '../../data/dto/request/BudgetUpdateRequestDTO';

export interface IBudgetSummaryUseCase {
  getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponseDTO>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null>;
  getCategoriesByType(type: 'Income' | 'Expense'): Promise<Category[]>;
  getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning>;
  updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void>;
  updateCategoryPlanning(data: CategoryPlanningUpdateRequestDTO): Promise<void>;
}
