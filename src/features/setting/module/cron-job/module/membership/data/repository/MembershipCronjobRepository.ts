import { decorate, inject, injectable } from 'inversify';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';
import { IMembershipCronjobDashboardApi } from '../api';
import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';
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
}

decorate(injectable(), MembershipCronjobRepository);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobDashboardApi),
  MembershipCronjobRepository,
  0,
);
