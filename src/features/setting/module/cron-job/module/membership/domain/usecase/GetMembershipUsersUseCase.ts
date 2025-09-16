import { decorate, inject, injectable } from 'inversify';
import { MembershipUserListResponse } from '../../data/dto/response/MembershipUserResponse';
import { IMembershipCronjobRepository } from '../../data/repository/IMembershipCronjobRepository';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';

export interface IGetMembershipUsersUseCase {
  execute(page: number, pageSize: number): Promise<MembershipUserListResponse>;
}

export class GetMembershipUsersUseCase implements IGetMembershipUsersUseCase {
  private repo: IMembershipCronjobRepository;

  constructor(repo: IMembershipCronjobRepository) {
    this.repo = repo;
  }

  async execute(page: number, pageSize: number): Promise<MembershipUserListResponse> {
    return this.repo.getMembershipUsers(page, pageSize);
  }
}

decorate(injectable(), GetMembershipUsersUseCase);
decorate(
  inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository),
  GetMembershipUsersUseCase,
  0,
);
