import { decorate, inject, injectable } from 'inversify';
import { IMembershipCronjobRepository } from '../../data/repository/IMembershipCronjobRepository';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';

export interface IGetMembershipDynamicFieldsUseCase {
  execute(): Promise<string[]>;
}

export class GetMembershipDynamicFieldsUseCase implements IGetMembershipDynamicFieldsUseCase {
  private repo: IMembershipCronjobRepository;

  constructor(repo: IMembershipCronjobRepository) {
    this.repo = repo;
  }

  async execute(): Promise<string[]> {
    return this.repo.getMembershipDynamicValue();
  }
}

decorate(injectable(), GetMembershipDynamicFieldsUseCase);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository),
  GetMembershipDynamicFieldsUseCase,
  0,
);
