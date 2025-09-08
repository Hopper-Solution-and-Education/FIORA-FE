import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';
import { MembershipCronjobMapper } from '../mapper';
import { IMembershipCronjobDashboardApi } from './IMembershipCronjobDashboardApi';

export class MembershipCronjobDashboardApi implements IMembershipCronjobDashboardApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse> {
    const searchParams = MembershipCronjobMapper.toSearchParams(page, pageSize, filter);
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobDashboard);
    const url = `${baseUrl}?${searchParams.toString()}`;

    return this.httpClient.get(url);
  }
}

decorate(injectable(), MembershipCronjobDashboardApi);
decorate(inject(MEMBERSHIP_CRONJOB_TYPES.IHttpClient), MembershipCronjobDashboardApi, 0);
