import { decorate, inject, injectable } from 'inversify';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IMembershipCronjobDashboardApi } from '../api';
import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';
import { MembershipCronjobMapper } from '../mapper';
import { IMembershipCronjobRepository } from './IMembershipCronjobRepository';

export class MembershipCronjobRepository implements IMembershipCronjobRepository {
  private api: IMembershipCronjobDashboardApi;

  constructor(api: IMembershipCronjobDashboardApi) {
    this.api = api;
  }

  async getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse> {
    const response = await this.api.getMembershipCronjobsPaginated(page, pageSize, filter);

    return response;
  }

  async getMembershipDynamicValue(): Promise<string[]> {
    const res = await this.api.getMembershipDynamicValue();
    return MembershipCronjobMapper.toDynamicValue(res);
  }
}

decorate(injectable(), MembershipCronjobRepository);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobDashboardApi),
  MembershipCronjobRepository,
  0,
);
