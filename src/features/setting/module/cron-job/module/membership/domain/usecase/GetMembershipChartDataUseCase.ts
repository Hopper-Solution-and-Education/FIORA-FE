import { decorate, inject, injectable } from 'inversify';
import { MembershipCronjobFilterRequest } from '../../data/dto/request/MembershipCronjobFilterRequest';
import { MembershipChartResponse } from '../../data/dto/response/MembershipChartResponse';
import { IMembershipCronjobRepository } from '../../data/repository/IMembershipCronjobRepository';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';

export interface IGetMembershipChartDataUseCase {
  execute(filter?: MembershipCronjobFilterRequest): Promise<MembershipChartResponse>;
}

export class GetMembershipChartDataUseCase implements IGetMembershipChartDataUseCase {
  private repo: IMembershipCronjobRepository;

  constructor(repo: IMembershipCronjobRepository) {
    this.repo = repo;
  }

  async execute(filter?: MembershipCronjobFilterRequest): Promise<MembershipChartResponse> {
    return this.repo.getMembershipChartData(filter);
  }
}

decorate(injectable(), GetMembershipChartDataUseCase);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository),
  GetMembershipChartDataUseCase,
  0,
);
