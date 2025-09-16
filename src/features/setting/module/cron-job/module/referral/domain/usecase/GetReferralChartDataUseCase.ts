import { decorate, inject, injectable } from 'inversify';
import { ReferralCronjobFilterRequest } from '../../data/dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../../data/dto/response/ReferralChartResponse';
import { IReferralCronjobRepository } from '../../data/repository/IReferralCronjobRepository';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';

export interface IGetReferralChartDataUseCase {
  execute(filter?: ReferralCronjobFilterRequest): Promise<ReferralChartResponse>;
}

export class GetReferralChartDataUseCase implements IGetReferralChartDataUseCase {
  private repo: IReferralCronjobRepository;

  constructor(repo: IReferralCronjobRepository) {
    this.repo = repo;
  }

  async execute(filter?: ReferralCronjobFilterRequest): Promise<ReferralChartResponse> {
    return this.repo.getReferralChartData(filter);
  }
}

decorate(injectable(), GetReferralChartDataUseCase);
decorate(inject(REFERRAL_CRONJOB_TYPES.IReferralCronjobRepository), GetReferralChartDataUseCase, 0);
