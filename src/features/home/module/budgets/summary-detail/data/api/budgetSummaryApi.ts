import { injectable } from 'inversify';
import { IBudgetSummaryAPI } from './IBudgetSummaryAPI';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  BudgetSummaryResponseDTO,
  BudgetByTypeResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryResponseDTO,
  CategoryPlanningResponseDTO,
} from '../dto/response/CategoryResponseDTO';
import { httpClient } from '@/config/http-client/HttpClient';
import { BudgetType } from '../../domain/entities/BudgetType';

@injectable()
export class BudgetSummaryAPI implements IBudgetSummaryAPI {
  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    try {
      return await httpClient.get<BudgetSummaryResponseDTO>(
        `/api/budgets/summary?fiscalYear=${params.fiscalYear}`,
      );
    } catch (error) {
      console.error('Error in BudgetSummaryAPI.getBudgetSummary:', error);
      throw error;
    }
  }

  async getBudgetByType(year: number, type: BudgetType): Promise<BudgetByTypeResponseDTO> {
    try {
      return await httpClient.get<BudgetByTypeResponseDTO>(
        `/api/budgets/summary?fiscalYear=${year}&type=${type}`,
      );
    } catch (error) {
      console.error(`Error in BudgetSummaryAPI.getBudgetByType for type ${type}:`, error);
      throw error;
    }
  }

  async getCategoriesByType(type: 'Income' | 'Expense'): Promise<CategoryResponseDTO> {
    try {
      const queryParams = new URLSearchParams({ type }).toString();
      return await httpClient.get<CategoryResponseDTO>(`/api/categories?${queryParams}`);
    } catch (error) {
      console.error('Error in BudgetSummaryAPI.getCategoriesByType:', error);
      throw error;
    }
  }

  async getActualPlanningByCategory(
    categoryId: string,
    year: number,
  ): Promise<CategoryPlanningResponseDTO> {
    try {
      const queryParams = new URLSearchParams({ year: year.toString() }).toString();
      return await httpClient.get<CategoryPlanningResponseDTO>(
        `/api/categories/sum-up/${categoryId}?${queryParams}`,
      );
    } catch (error) {
      console.error('Error in BudgetSummaryAPI.getActualPlanningByCategory:', error);
      throw error;
    }
  }
}

export default new BudgetSummaryAPI();
