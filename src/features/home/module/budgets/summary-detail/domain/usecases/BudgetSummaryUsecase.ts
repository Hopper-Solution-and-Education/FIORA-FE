import { Currency, HttpResponse } from '@/shared/types';
import { decorate, inject, injectable } from 'inversify';
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
import type { IBudgetSummaryRepository } from '../../data/repositories/IBudgetSummaryRepository';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { Budget } from '../entities/Budget';
import { BudgetSummaryByType } from '../entities/BudgetSummaryByType';
import { BudgetType } from '../entities/BudgetType';
import { IBudgetSummaryUseCase } from './IBudgetSummaryUseCase';

export class BudgetSummaryUsecase implements IBudgetSummaryUseCase {
  constructor(private readonly budgetSummaryRepository: IBudgetSummaryRepository) {}

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

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO, currency: Currency): Promise<Budget> {
    return this.budgetSummaryRepository.updateTopDownPlanning(data, currency);
  }

  async updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<CategoryPlanningUpdateResponse> {
    return this.budgetSummaryRepository.updateCategoryPlanning(data, currency);
  }

  async getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>> {
    return this.budgetSummaryRepository.getBudgetYears();
  }

  async deleteCategory(data: DeleteCategoryRequestDTO): Promise<string> {
    return this.budgetSummaryRepository.deleteCategory(data);
  }
}

decorate(injectable(), BudgetSummaryUsecase);
decorate(inject(TYPES.IBudgetSummaryRepository), BudgetSummaryUsecase, 0);
