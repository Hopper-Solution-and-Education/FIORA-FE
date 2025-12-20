import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipResendRequest } from '../dto/request/MembershipResendRequest';
import { MembershipChartResponse } from '../dto/response/MembershipChartResponse';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';
import { MembershipTierListResponse } from '../dto/response/MembershipTierResponse';
import { MembershipUserListResponse } from '../dto/response/MembershipUserResponse';
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

  async getMembershipDynamicValue() {
    return this.httpClient.get(routeConfig(ApiEndpointEnum.CronjobDashboardDefineType));
  }

  async getMembershipChartData(
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipChartResponse> {
    const searchParams = MembershipCronjobMapper.toChartSearchParams(filter);
    const baseUrl = routeConfig(ApiEndpointEnum.CronjobChart);
    const url = `${baseUrl}?${searchParams.toString()}`;

    return this.httpClient.get(url);
  }

  async getMembershipTiers(page: number, pageSize: number): Promise<MembershipTierListResponse> {
    const baseUrl = routeConfig(ApiEndpointEnum.MembershipTiers);
    const params = new URLSearchParams();

    params.append('page', String(page));
    params.append('pageSize', String(pageSize));

    const url = `${baseUrl}?${params.toString()}`;
    return this.httpClient.get(url);
  }

  async getMembershipUsers(page: number, pageSize: number): Promise<MembershipUserListResponse> {
    const baseUrl = routeConfig(ApiEndpointEnum.Users);
    const params = new URLSearchParams();

    params.append('page', String(page));
    params.append('pageSize', String(pageSize));

    const url = `${baseUrl}?${params.toString()}`;
    return this.httpClient.get(url);
  }

  async resendMembership(id: string, body: MembershipResendRequest): Promise<any> {
    const base = routeConfig(ApiEndpointEnum.CronjobResend, { id });
    return this.httpClient.patch(base, body);
  }
}

decorate(injectable(), MembershipCronjobDashboardApi);
decorate(inject(MEMBERSHIP_CRONJOB_TYPES.IHttpClient), MembershipCronjobDashboardApi, 0);
