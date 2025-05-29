import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import { BudgetType } from '../../domain/entities/BudgetType';
import type { IBudgetSummaryAPI } from '../api/IBudgetSummaryAPI';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  CategoryPlanningUpdateRequestDTO,
  TopDownUpdateRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import { BudgetSummaryResponseDTO } from '../dto/response/BudgetSummaryResponseDTO';
import { Category, CategoryPlanning } from '../dto/response/CategoryResponseDTO';
import { BudgetSummaryMapper } from '../mappers/BudgetSummaryMapper';
import { IBudgetSummaryRepository } from './IBudgetSummaryRepository';

@injectable()
export class BudgetSummaryRepository implements IBudgetSummaryRepository {
  constructor(@inject(TYPES.IBudgetSummaryAPI) private budgetSummaryAPI: IBudgetSummaryAPI) {}

  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    try {
      return await this.budgetSummaryAPI.getBudgetSummary(params);
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType | null> {
    try {
      const data = await this.budgetSummaryAPI.getBudgetByType(fiscalYear, type);
      return BudgetSummaryMapper.toBudgetByType(data);
    } catch (error) {
      console.error(`Error fetching budget by type ${type}:`, error);
      throw error;
    }
  }

  async getBudgetsByUserIdAndFiscalYear(
    userId: string,
    fiscalYear: number,
  ): Promise<BudgetSummaryResponseDTO> {
    try {
      return await this.budgetSummaryAPI.getBudgetSummary({ fiscalYear });
    } catch (error) {
      console.error('Error fetching budgets by user ID and fiscal year:', error);
      throw error;
    }
  }

  async getCategoriesByType(type: 'Income' | 'Expense'): Promise<Category[]> {
    const response = await this.budgetSummaryAPI.getCategoriesByType(type);
    return response.data;
  }

  async getActualPlanningByCategory(categoryId: string, year: number): Promise<CategoryPlanning> {
    const response = await this.budgetSummaryAPI.getActualPlanningByCategory(categoryId, year);
    return response.data;
  }

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void> {
    await this.budgetSummaryAPI.updateTopDownPlanning(data);
  }

  async updateCategoryPlanning(data: CategoryPlanningUpdateRequestDTO): Promise<void> {
    await this.budgetSummaryAPI.updateCategoryPlanning(data);
  }
}
