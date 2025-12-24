import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';

import { Response } from '@/shared/types';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';
import { CampaignSettings } from '../../presentation/types/referral.type';
import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../dto/response/ReferralChartResponse';
import {
  CampaignResponse,
  ReferralCronjobPaginatedResponse,
} from '../dto/response/ReferralCronjobResponse';
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
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobDashboardReferral);
    const body = ReferralCronjobMapper.toPostBody(page, pageSize, filter);

    return this.httpClient.post(baseUrl, body);
  }

  async getReferralChartData(
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralChartResponse> {
    const searchParams = ReferralCronjobMapper.toChartSearchParams(filter);
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobChartReferral);
    const url = `${baseUrl}?${searchParams.toString()}`;

    return this.httpClient.get(url);
  }

  async getReferralFilterOptions(): Promise<any> {
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobDashboardReferral);
    return this.httpClient.get(baseUrl);
  }

  async getCampaign(): Promise<Response<CampaignResponse>> {
    const baseUrl = routeConfig(ApiEndpointEnum.ReferralCampaign);
    return this.httpClient.get(baseUrl);
  }

  async upsertCampaign(data: CampaignSettings): Promise<any> {
    const baseUrl = routeConfig(ApiEndpointEnum.ReferralCampaign);
    const body = { dynamicValue: data };

    return this.httpClient.post(baseUrl, body);
  }
}

decorate(injectable(), ReferralCronjobDashboardApi);
decorate(inject(REFERRAL_CRONJOB_TYPES.IHttpClient), ReferralCronjobDashboardApi, 0);
