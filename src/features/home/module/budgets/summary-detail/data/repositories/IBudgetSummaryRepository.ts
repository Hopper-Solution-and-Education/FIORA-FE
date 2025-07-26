import { Currency, HttpResponse } from '@/shared/types';
import { Budget } from '../../domain/entities/Budget';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetType } from '../../domain/entities/BudgetType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
  TopDownUpdateRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import {
  BudgetSummaryResponseDTO,
  BudgetYearsResponseDTO,
  CategoryPlanningUpdateResponse,
} from '../dto/response/BudgetSummaryResponseDTO';
import { Category, CategoryPlanning } from '../dto/response/CategoryResponseDTO';

export interface IBudgetSummaryRepository {
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null>;
  getBudgetsByUserIdAndFiscalYear(fiscalYear: number): Promise<BudgetSummaryResponseDTO>;
  getCategoriesByType(type: 'Income' | 'Expense', year: number): Promise<Category[]>;
  getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning>;
  updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<Budget>;
  updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<CategoryPlanningUpdateResponse>;
  getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>>;
  deleteCategory(data: DeleteCategoryRequestDTO): Promise<string>;
}
