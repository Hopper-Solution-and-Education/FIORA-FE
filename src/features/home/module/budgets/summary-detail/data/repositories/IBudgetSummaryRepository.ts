import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import { BudgetType } from '../../domain/entities/BudgetType';
import {
  BudgetSummaryResponseDTO,
  BudgetYearsResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import { Category, CategoryPlanning } from '../dto/response/CategoryResponseDTO';
import {
  TopDownUpdateRequestDTO,
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import { Currency, HttpResponse } from '@/shared/types';

export interface IBudgetSummaryRepository {
  getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO>;
  getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null>;
  getBudgetsByUserIdAndFiscalYear(fiscalYear: number): Promise<BudgetSummaryResponseDTO>;
  getCategoriesByType(type: 'Income' | 'Expense'): Promise<Category[]>;
  getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning>;
  updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void>;
  updateCategoryPlanning(data: CategoryPlanningUpdateRequestDTO, currency: Currency): Promise<void>;
  getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>>;
  deleteCategory(data: DeleteCategoryRequestDTO): Promise<void>;
}
