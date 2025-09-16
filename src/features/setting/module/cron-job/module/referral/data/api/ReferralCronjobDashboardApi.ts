import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';

import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';
import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../dto/response/ReferralChartResponse';
import { ReferralCronjobPaginatedResponse } from '../dto/response/ReferralCronjobResponse';
import { ReferralCronjobMapper } from '../mapper';
import { IReferralCronjobDashboardApi } from './IReferralCronjobDashboardApi';

export class ReferralCronjobDashboardApi implements IReferralCronjobDashboardApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getReferralCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse> {
    const searchParams = ReferralCronjobMapper.toSearchParams(page, pageSize, filter);
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobDashboardReferral);
    const url = `${baseUrl}?${searchParams.toString()}`;

    return this.httpClient.get(url);
  }

  async getReferralChartData(
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralChartResponse> {
    const searchParams = ReferralCronjobMapper.toChartSearchParams(filter);
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobChartReferral);
    const url = `${baseUrl}?${searchParams.toString()}`;

    return this.httpClient.get(url);
  }
}

decorate(injectable(), ReferralCronjobDashboardApi);
decorate(inject(REFERRAL_CRONJOB_TYPES.IHttpClient), ReferralCronjobDashboardApi, 0);
