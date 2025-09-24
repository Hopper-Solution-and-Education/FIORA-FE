import { decorate, inject, injectable } from 'inversify';
import { IReferralCronjobRepository } from '../../data/repository/IReferralCronjobRepository';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';

export interface IGetReferralFilterOptionsUseCase {
  execute(): Promise<any>;
}

export class GetReferralFilterOptionsUseCase implements IGetReferralFilterOptionsUseCase {
  private repo: IReferralCronjobRepository;

  constructor(repo: IReferralCronjobRepository) {
    this.repo = repo;
  }

  async execute(): Promise<any> {
    return this.repo.getReferralFilterOptions();
  }
}

decorate(injectable(), GetReferralFilterOptionsUseCase);
decorate(
  inject(REFERRAL_CRONJOB_TYPES.IReferralCronjobRepository),
  GetReferralFilterOptionsUseCase,
  0,
);
