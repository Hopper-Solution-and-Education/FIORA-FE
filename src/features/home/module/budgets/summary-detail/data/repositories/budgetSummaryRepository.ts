import { Currency, HttpResponse } from '@/shared/types';
import { decorate, inject, injectable } from 'inversify';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { Budget } from '../../domain/entities/Budget';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetType } from '../../domain/entities/BudgetType';
import type { IBudgetSummaryAPI } from '../api/IBudgetSummaryAPI';
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
import { BudgetSummaryMapper } from '../mappers/BudgetSummaryMapper';
import { IBudgetSummaryRepository } from './IBudgetSummaryRepository';

export class BudgetSummaryRepository implements IBudgetSummaryRepository {
  constructor(private budgetSummaryAPI: IBudgetSummaryAPI) {}

  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    return await this.budgetSummaryAPI.getBudgetSummary(params);
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null> {
    const data = await this.budgetSummaryAPI.getBudgetByType(fiscalYear, type);
    return BudgetSummaryMapper.toBudgetByType(data);
  }

  async getBudgetsByUserIdAndFiscalYear(fiscalYear: number): Promise<BudgetSummaryResponseDTO> {
    return await this.budgetSummaryAPI.getBudgetSummary({ fiscalYear });
  }

  async getCategoriesByType(type: 'Income' | 'Expense', year: number): Promise<Category[]> {
    const response = await this.budgetSummaryAPI.getCategoriesByType(type, year);
    return response.data;
  }

  async getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning> {
    const response = await this.budgetSummaryAPI.getActualPlanningByCategory(categoryId, year);
    return response.data;
  }

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<Budget> {
    return await this.budgetSummaryAPI.updateTopDownPlanning(data);
  }

  async updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<CategoryPlanningUpdateResponse> {
    return await this.budgetSummaryAPI.updateCategoryPlanning(data, currency);
  }

  async getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>> {
    return await this.budgetSummaryAPI.getBudgetYears();
  }

  async deleteCategory(data: DeleteCategoryRequestDTO): Promise<string> {
    return await this.budgetSummaryAPI.deleteCategory(data);
  }
}

decorate(injectable(), BudgetSummaryRepository);
decorate(inject(TYPES.IBudgetSummaryAPI), BudgetSummaryRepository, 0);
