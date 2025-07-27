import { Currency, HttpResponse } from '@/shared/types';
import {
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
  TopDownUpdateRequestDTO,
} from '../../data/dto/request/BudgetUpdateRequestDTO';
import {
  BudgetSummaryResponseDTO,
  BudgetYearsResponseDTO,
  CategoryPlanningUpdateResponse,
} from '../../data/dto/response/BudgetSummaryResponseDTO';
import { Category, CategoryPlanning } from '../../data/dto/response/CategoryResponseDTO';
import { Budget } from '../entities/Budget';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';
import { BudgetType } from '../entities/BudgetType';

export interface IBudgetSummaryUseCase {
  getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponseDTO>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null>;
  getCategoriesByType(type: 'Income' | 'Expense', year: number): Promise<Category[]>;
  getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning>;
  updateTopDownPlanning(data: TopDownUpdateRequestDTO, currency: Currency): Promise<Budget>;
  updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<CategoryPlanningUpdateResponse>;
  getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>>;
  deleteCategory(data: DeleteCategoryRequestDTO): Promise<string>;
}
