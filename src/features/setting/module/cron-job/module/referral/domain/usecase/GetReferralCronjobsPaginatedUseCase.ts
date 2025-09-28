import { decorate, inject, injectable } from 'inversify';
import { ReferralCronjobFilterRequest } from '../../data/dto/request/ReferralCronjobFilterRequest';
import { ReferralCronjobPaginatedResponse } from '../../data/dto/response/ReferralCronjobResponse';
import { IReferralCronjobRepository } from '../../data/repository/IReferralCronjobRepository';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';

export interface IGetReferralCronjobsPaginatedUseCase {
  execute(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse>;
}

export class GetReferralCronjobsPaginatedUseCase implements IGetReferralCronjobsPaginatedUseCase {
  private repo: IReferralCronjobRepository;

  constructor(repo: IReferralCronjobRepository) {
    this.repo = repo;
  }

  async execute(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse> {
    return this.repo.getReferralCronjobsPaginated(page, pageSize, filter);
  }
}

decorate(injectable(), GetReferralCronjobsPaginatedUseCase);
decorate(
  inject(REFERRAL_CRONJOB_TYPES.IReferralCronjobRepository),
  GetReferralCronjobsPaginatedUseCase,
  0,
);
