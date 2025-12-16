import { httpClient } from '@/config/http-client/HttpClient';
import { ApiEndpointEnum } from '@/shared/constants';
import { Currency, HttpResponse } from '@/shared/types';
import { routeConfig } from '@/shared/utils/route';
import { decorate, injectable } from 'inversify';
import { Budget } from '../../domain/entities/Budget';
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
  CategoryPlanningUpdateResponse,
} from '../dto/response/BudgetSummaryResponseDTO';
import {
  CategoryPlanningResponseDTO,
  CategoryResponseDTO,
} from '../dto/response/CategoryResponseDTO';
import { IBudgetSummaryAPI } from './IBudgetSummaryAPI';

export class BudgetSummaryAPI implements IBudgetSummaryAPI {
  async getBudgetSummary(params: BudgetSummaryRequestDTO): Promise<BudgetSummaryResponseDTO> {
    return await httpClient.get<BudgetSummaryResponseDTO>(
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
    return await httpClient.get<CategoryResponseDTO>(
      routeConfig(ApiEndpointEnum.CategoriesByType, {}, { type, year }),
    );
  }

  async getActualPlanningByCategory(
    categoryId: string,
    year: number,
  ): Promise<CategoryPlanningResponseDTO> {
    return await httpClient.get<CategoryPlanningResponseDTO>(
      routeConfig(ApiEndpointEnum.BudgetActualPlanningSumUp, { categoryId }, { year }),
    );
  }

  async updateTopDownPlanning(data: TopDownUpdateRequestDTO, currency: Currency): Promise<Budget> {
    const response = await httpClient.put(ApiEndpointEnum.BudgetTopDownUpdate, data, {
      'x-user-currency': currency,
    });

    return (response as any).data;
  }

  async updateCategoryPlanning(
    data: CategoryPlanningUpdateRequestDTO,
    currency: Currency,
  ): Promise<CategoryPlanningUpdateResponse> {
    const response: HttpResponse<CategoryPlanningUpdateResponse> = await httpClient.put(
      ApiEndpointEnum.BudgetCategories,
      data,
      {
        'x-user-currency': currency,
      },
    );

    const responseData = response?.data;

    const { updatedBudgetDetails, actBudgetDetails, bottomUpBudget } = responseData;

    return {
      updatedBudgetDetails,
      actBudgetDetails,
      bottomUpBudget,
      currency: responseData.currency || currency,
    };
  }

  async deleteCategory(data: DeleteCategoryRequestDTO): Promise<string> {
    const response: any = await httpClient.post<void>(ApiEndpointEnum.BudgetCategories, data);
    return response?.data?.code || '';
  }

  async getBudgetYears(): Promise<HttpResponse<BudgetYearsResponseDTO>> {
    return await httpClient.get<HttpResponse<BudgetYearsResponseDTO>>(ApiEndpointEnum.BudgetYears);
  }
}

// Apply decorators programmatically
decorate(injectable(), BudgetSummaryAPI);
