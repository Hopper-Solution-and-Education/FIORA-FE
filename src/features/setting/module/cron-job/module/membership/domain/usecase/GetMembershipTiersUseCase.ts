import { decorate, inject, injectable } from 'inversify';
import { MembershipTierListResponse } from '../../data/dto/response/MembershipTierResponse';
import { IMembershipCronjobRepository } from '../../data/repository/IMembershipCronjobRepository';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';

export interface IGetMembershipTiersUseCase {
  execute(page: number, pageSize: number): Promise<MembershipTierListResponse>;
}

export class GetMembershipTiersUseCase implements IGetMembershipTiersUseCase {
  private repo: IMembershipCronjobRepository;

  constructor(repo: IMembershipCronjobRepository) {
    this.repo = repo;
  }

  async execute(page: number, pageSize: number): Promise<MembershipTierListResponse> {
    return this.repo.getMembershipTiers(page, pageSize);
  }
}

decorate(injectable(), GetMembershipTiersUseCase);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository),
  GetMembershipTiersUseCase,
  0,
);
