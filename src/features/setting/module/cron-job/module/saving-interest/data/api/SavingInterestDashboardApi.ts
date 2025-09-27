import type { IHttpClient } from '@/config';
import { decorate, inject, injectable } from 'inversify';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';
import {
  SavingInterestChartResponse,
  SavingInterestResponse,
  SmartSavingStatisticsApiResponse,
  SmartSavingTableApiResponse,
} from '../dto/response/SavingInterestResponse';
import {
  FilterOptions,
  ISavingInterestDashboardApi,
  SavingInterestFilters,
} from './ISavingInterestDashboardApi';

export class SavingInterestDashboardApi implements ISavingInterestDashboardApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getSavingInterestData(
    page: number,
    pageSize: number,
    filters: SavingInterestFilters,
  ): Promise<SavingInterestResponse> {
    const body = {
      page,
      pageSize,
      search: filters.search || '',
      status: filters.status.length > 0 ? filters.status : undefined,
      tierName: filters.membershipTier.length > 0 ? filters.membershipTier : undefined,
      email: filters.email.length > 0 ? filters.email : undefined,
      emailUpdateBy: filters.updatedBy.length > 0 ? filters.updatedBy : undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
    };

    // Remove undefined values
    Object.keys(body).forEach((key) => {
      if (body[key as keyof typeof body] === undefined) {
        delete body[key as keyof typeof body];
      }
    });

    const baseUrl = '/api/smart-saving';
    const response = await this.httpClient.post<SmartSavingTableApiResponse>(baseUrl, body);

    // Extract data from the nested response structure
    return {
      items: response.data.items,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages,
      totalSuccess: response.data.totalSuccess,
      totalFailed: response.data.totalFailed,
    };
  }

  async getSavingInterestChartData(
    filters: Partial<SavingInterestFilters>,
  ): Promise<SavingInterestChartResponse> {
    const baseUrl = '/api/smart-saving/statistics';
    const response = await this.httpClient.get<SmartSavingStatisticsApiResponse>(baseUrl);

    // Extract data from the nested response structure
    return {
      tierInterestAmount: response.data.tierInterestAmount,
      totalInterestAmount: response.data.totalInterestAmount,
    };
  }

  async getFilterOptions(): Promise<FilterOptions> {
    const baseUrl = '/api/smart-saving';
    const response = await this.httpClient.get<{
      status: number;
      message: string;
      data: FilterOptions;
    }>(baseUrl);

    // Extract data from the nested response structure
    return {
      emailOptions: response.data.emailOptions,
      tierNameOptions: response.data.tierNameOptions,
      updateByOptions: response.data.updateByOptions,
    };
  }
}

decorate(injectable(), SavingInterestDashboardApi);
decorate(inject(SAVING_INTEREST_TYPES.IHttpClient), SavingInterestDashboardApi, 0);
