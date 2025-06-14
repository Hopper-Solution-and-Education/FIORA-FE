import { BudgetType } from '../entities/BudgetType';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import type { IBudgetSummaryRepository } from '../../data/repositories/IBudgetSummaryRepository';
import { IBudgetSummaryUseCase } from './IBudgetSummaryUseCase';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';
import {
  BudgetSummaryResponseDTO,
  BudgetYearsResponseDTO,
} from '../../data/dto/response/BudgetSummaryResponseDTO';
import { Category, CategoryPlanning } from '../../data/dto/response/CategoryResponseDTO';
import {
  TopDownUpdateRequestDTO,
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
} from '../../data/dto/request/BudgetUpdateRequestDTO';
import { Currency, HttpResponse } from '@/shared/types';

@injectable()
export class BudgetSummaryUsecase implements IBudgetSummaryUseCase {
  constructor(
    @inject(TYPES.IBudgetSummaryRepository)
    private readonly budgetSummaryRepository: IBudgetSummaryRepository,
  ) {}

  async getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponseDTO> {
    return this.budgetSummaryRepository.getBudgetsByUserIdAndFiscalYear(fiscalYear);
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null> {
    return this.budgetSummaryRepository.getBudgetByType(fiscalYear, type);
  }

  async getCategoriesByType(type: 'Income' | 'Expense', year: number): Promise<Category[]> {
    return this.budgetSummaryRepository.getCategoriesByType(type, year);
  }

  async getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning> {
    return this.budgetSummaryRepository.getActualPlanningByCategory(categoryId, year);
  }

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void> {
    return this.budgetSummaryRepository.updateTopDownPlanning(data);
  }

  async updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<void> {
    return this.budgetSummaryRepository.updateCategoryPlanning(data, currency);
  }

  async getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>> {
    return this.budgetSummaryRepository.getBudgetYears();
  }

  async deleteCategory(data: DeleteCategoryRequestDTO): Promise<string> {
    return await this.budgetSummaryRepository.deleteCategory(data);
  }
}
