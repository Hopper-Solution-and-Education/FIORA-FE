import { Currency, HttpResponse } from '@/shared/types';
import { Budget } from '../../domain/entities/Budget';
import { BudgetType } from '../../domain/entities/BudgetType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
  TopDownUpdateRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import {
  BudgetByTypeResponseDTO,
  BudgetSummaryResponseDTO,
  BudgetYearsResponseDTO,
  CategoryPlanningUpdateResponse,
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryPlanningResponseDTO,
  CategoryResponseDTO,
} from '../dto/response/CategoryResponseDTO';

export interface IBudgetSummaryAPI {
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetByTypeResponseDTO>;
  getCategoriesByType(type: 'Income' | 'Expense', year: number): Promise<CategoryResponseDTO>;
  getActualPlanningByCategory(
    categoryId: string,
    year: number,
  ): Promise<CategoryPlanningResponseDTO>;
  updateTopDownPlanning(data: TopDownUpdateRequestDTO, currency: Currency): Promise<Budget>;
  updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<CategoryPlanningUpdateResponse>;
  getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>>;
  deleteCategory(data: DeleteCategoryRequestDTO): Promise<string>;
}
