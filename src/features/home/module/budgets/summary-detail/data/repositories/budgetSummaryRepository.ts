import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/budgetSummaryDIContainer.type';
import { BudgetSummary } from '../../domain/entities/BudgetSummary';
import { BudgetSummaryByType } from '../../domain/entities/BudgetSummaryByType';
import type { IBudgetSummaryAPI } from '../api/IBudgetSummaryAPI';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import { BudgetSummaryMapper } from '../mappers/BudgetSummaryMapper';
import { IBudgetSummaryRepository } from './IBudgetSummaryRepository';
import { Budget } from '../../domain/entities/Budget';
import { BudgetType } from '../../domain/entities/BudgetType';
import { Category, CategoryPlanning } from '../dto/response/CategoryResponseDTO';

@injectable()
export class BudgetSummaryRepository implements IBudgetSummaryRepository {
  constructor(@inject(TYPES.IBudgetSummaryAPI) private budgetSummaryAPI: IBudgetSummaryAPI) {}

  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummary> {
    try {
      const data = await this.budgetSummaryAPI.getBudgetSummary(params);
      return BudgetSummaryMapper.toBudgetSummary(data);
    } catch (error) {
      console.error('Error fetching budget summary:', error);
      throw error;
    }
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetSummaryByType> {
    try {
      const data = await this.budgetSummaryAPI.getBudgetByType(fiscalYear, type);
      return BudgetSummaryMapper.toBudgetByType(data);
    } catch (error) {
      console.error(`Error fetching budget by type ${type}:`, error);
      throw error;
    }
  }

  async getBudgetsByUserIdAndFiscalYear(userId: string, fiscalYear: number): Promise<Budget[]> {
    try {
      const data = await this.budgetSummaryAPI.getBudgetSummary({ fiscalYear });
      return data.allBudgets.filter((budget) => budget.userId === userId);
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
}
