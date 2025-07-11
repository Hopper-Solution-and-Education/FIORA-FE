/* eslint-disable import/no-anonymous-default-export */
import { httpClient } from '@/config/http-client/HttpClient';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { Currency, HttpResponse } from '@/shared/types';
import { routeConfig } from '@/shared/utils/route';
import { injectable } from 'inversify';
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
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryPlanningResponseDTO,
  CategoryResponseDTO,
} from '../dto/response/CategoryResponseDTO';
import { IBudgetSummaryAPI } from './IBudgetSummaryAPI';

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

  async getCategoriesByType(
    type: 'Income' | 'Expense',
    year: number,
  ): Promise<CategoryResponseDTO> {
    return httpClient.get<CategoryResponseDTO>(
      routeConfig(ApiEndpointEnum.CategoriesByType, {}, { type, year }),
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

  async deleteCategory(data: DeleteCategoryRequestDTO): Promise<string> {
    const response: any = await httpClient.post<void>(ApiEndpointEnum.BudgetCategories, data);

    return response?.data.code || '';
  }

  async getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>> {
    return httpClient.get<HttpResponse<BudgetYearsResponseDTO>>(ApiEndpointEnum.BudgetYears);
  }
}

export default new BudgetSummaryAPI();
