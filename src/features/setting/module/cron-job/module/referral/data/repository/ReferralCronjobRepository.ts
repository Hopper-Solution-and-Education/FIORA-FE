import { decorate, inject, injectable } from 'inversify';
import { IReferralCronjobDashboardApi } from '../api/IReferralCronjobDashboardApi';
import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../dto/response/ReferralChartResponse';
import { ReferralCronjobPaginatedResponse } from '../dto/response/ReferralCronjobResponse';
import { IReferralCronjobRepository } from './IReferralCronjobRepository';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';

export class ReferralCronjobRepository implements IReferralCronjobRepository {
  private api: IReferralCronjobDashboardApi;

  constructor(api: IReferralCronjobDashboardApi) {
    this.api = api;
  }

  async getReferralCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse> {
    return this.api.getReferralCronjobsPaginated(page, pageSize, filter);
  }

  async getReferralChartData(
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralChartResponse> {
    return this.api.getReferralChartData(filter);
  }
}

decorate(injectable(), ReferralCronjobRepository);
decorate(inject(REFERRAL_CRONJOB_TYPES.IReferralCronjobDashboardApi), ReferralCronjobRepository, 0);
