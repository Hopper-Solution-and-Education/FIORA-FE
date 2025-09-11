import { decorate, inject, injectable } from 'inversify';
import { MembershipCronjobFilterRequest } from '../../data/dto/request/MembershipCronjobFilterRequest';
import { MembershipCronjobPaginatedResponse } from '../../data/dto/response/MembershipCronjobResponse';
import { IMembershipCronjobRepository } from '../../data/repository/IMembershipCronjobRepository';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';

export interface IGetMembershipCronjobsPaginatedUseCase {
  execute(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse>;
}

export class GetMembershipCronjobsPaginatedUseCase
  implements IGetMembershipCronjobsPaginatedUseCase
{
  private repo: IMembershipCronjobRepository;

  constructor(repo: IMembershipCronjobRepository) {
    this.repo = repo;
  }

  async execute(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse> {
    return this.repo.getMembershipCronjobsPaginated(page, pageSize, filter);
  }
}

decorate(injectable(), GetMembershipCronjobsPaginatedUseCase);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository),
  GetMembershipCronjobsPaginatedUseCase,
  0,
);
