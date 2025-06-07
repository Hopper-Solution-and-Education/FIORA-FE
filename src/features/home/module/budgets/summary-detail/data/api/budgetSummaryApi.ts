import { injectable } from 'inversify';
import { IBudgetSummaryAPI } from './IBudgetSummaryAPI';
import { BudgetSummaryRequestDTO } from '../dto/request/BudgetSummaryRequestDTO';
import {
  BudgetSummaryResponseDTO,
  BudgetByTypeResponseDTO,
  BudgetYearsResponseDTO,
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryResponseDTO,
  CategoryPlanningResponseDTO,
} from '../dto/response/CategoryResponseDTO';
import {
  TopDownUpdateRequestDTO,
  CategoryPlanningUpdateRequestDTO,
  DeleteCategoryRequestDTO,
} from '../dto/request/BudgetUpdateRequestDTO';
import { httpClient } from '@/config/http-client/HttpClient';
import { BudgetType } from '../../domain/entities/BudgetType';
import { Currency, HttpResponse } from '@/shared/types';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';

@injectable()
export class BudgetSummaryAPI implements IBudgetSummaryAPI {
  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    return httpClient.get<BudgetSummaryResponseDTO>(
      routeConfig(ApiEndpointEnum.BudgetByType, {}, { fiscalYear: params.fiscalYear }),
    );
  }

  async getBudgetByType(fiscalYear: number, type: BudgetType): Promise<BudgetByTypeResponseDTO> {
    return await httpClient.get<BudgetByTypeResponseDTO>(
      routeConfig(ApiEndpointEnum.BudgetByType, {}, { fiscalYear, type }),
    );
  }

  async getCategoriesByType(type: 'Income' | 'Expense'): Promise<CategoryResponseDTO> {
    return httpClient.get<CategoryResponseDTO>(
      routeConfig(ApiEndpointEnum.CategoriesByType, {}, { type }),
    );
  }

  async getActualPlanningByCategory(
    categoryId: string,
    year: number,
  ): Promise<CategoryPlanningResponseDTO> {
    return httpClient.get<CategoryPlanningResponseDTO>(
      routeConfig(ApiEndpointEnum.BudgetActualPlanningSumUp, { categoryId }, { year }),
    );
  }

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO): Promise<void> {
    await httpClient.put<void>(ApiEndpointEnum.BudgetTopDownUpdate, data);
  }

  async updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<void> {
    await httpClient.put<void>(ApiEndpointEnum.BudgetCategories, data, {
      'x-user-currency': currency,
    });
  }

  async deleteCategory(data: DeleteCategoryRequestDTO): Promise<void> {
    await httpClient.post<void>(ApiEndpointEnum.BudgetCategories, data);
  }

  async getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>> {
    return httpClient.get<HttpResponse<BudgetYearsResponseDTO>>(ApiEndpointEnum.BudgetYears);
  }
}

export default new BudgetSummaryAPI();
