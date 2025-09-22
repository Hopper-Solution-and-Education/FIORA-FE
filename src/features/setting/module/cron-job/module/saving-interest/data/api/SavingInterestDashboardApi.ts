import type { IHttpClient } from '@/config';
import { decorate, inject, injectable } from 'inversify';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';
import {
  SavingInterestChartResponse,
  SavingInterestResponse,
} from '../dto/response/SavingInterestResponse';
import { ISavingInterestDashboardApi, SavingInterestFilters } from './ISavingInterestDashboardApi';

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
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (filters.search) params.append('search', filters.search);
    if (filters.status.length > 0) filters.status.forEach((s) => params.append('status', s));
    if (filters.membershipTier.length > 0)
      filters.membershipTier.forEach((t) => params.append('membershipTier', t));
    if (filters.email.length > 0) filters.email.forEach((e) => params.append('email', e));
    if (filters.updatedBy.length > 0)
      filters.updatedBy.forEach((u) => params.append('updatedBy', u));
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);

    const baseUrl = '/api/dashboard/saving-interest';
    const url = `${baseUrl}?${params.toString()}`;

    return this.httpClient.get<SavingInterestResponse>(url);
  }

  async getSavingInterestChartData(
    filters: Partial<SavingInterestFilters>,
  ): Promise<SavingInterestChartResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.status?.length) filters.status.forEach((s) => params.append('status', s));
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);

    const baseUrl = '/api/dashboard/saving-interest-chart';
    const url = `${baseUrl}?${params.toString()}`;

    return this.httpClient.get<SavingInterestChartResponse>(url);
  }
}

decorate(injectable(), SavingInterestDashboardApi);
decorate(inject(SAVING_INTEREST_TYPES.IHttpClient), SavingInterestDashboardApi, 0);
