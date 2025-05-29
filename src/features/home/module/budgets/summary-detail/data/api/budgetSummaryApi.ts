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
import {
  TopDownUpdateRequestDTO,
  CategoryPlanningUpdateRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import { httpClient } from '@/config/http-client/HttpClient';
import { BudgetType } from '../../domain/entities/BudgetType';

@injectable()
export class BudgetSummaryAPI implements IBudgetSummaryAPI {
  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    return httpClient.get<BudgetSummaryResponseDTO>(
      `/api/budgets/summary?fiscalYear=${params.fiscalYear}`,
    );
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
    return httpClient.get<CategoryResponseDTO>(`/api/categories?type=${type}`);
  }

  async getActualPlanningByCategory(
    categoryId: string,
    year: number,
  ): Promise<CategoryPlanningResponseDTO> {
    return httpClient.get<CategoryPlanningResponseDTO>(
      `/api/budgets/categories/${categoryId}/planning?year=${year}`,
    );
  }

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void> {
    await httpClient.put<void>('/api/budgets/summary/update', data);
  }

  async updateCategoryPlanning(data: CategoryPlanningUpdateRequestDTO): Promise<void> {
    await httpClient.put<void>('/api/budgets/categories', data);
  }
}

export default new BudgetSummaryAPI();
