import { decorate, inject, injectable } from 'inversify';
import { MembershipResendRequest } from '../../data/dto/request/MembershipResendRequest';
import { IMembershipCronjobRepository } from '../../data/repository/IMembershipCronjobRepository';
import { MEMBERSHIP_CRONJOB_TYPES } from '../../di/membershipCronjobDashboardDI.type';

export interface IResendMembershipUseCase {
  execute(id: string, body: MembershipResendRequest): Promise<any>;
}

export class ResendMembershipUseCase implements IResendMembershipUseCase {
  private repo: IMembershipCronjobRepository;

  constructor(repo: IMembershipCronjobRepository) {
    this.repo = repo;
  }

  async execute(id: string, body: MembershipResendRequest): Promise<any> {
    return this.repo.resendMembership(id, body);
  }
}

decorate(injectable(), ResendMembershipUseCase);
decorate(inject(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository), ResendMembershipUseCase, 0);
