import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { UpsertMembershipRequest, UpsertMembershipResponse } from '../entities';

export interface IUpsertMembershipUseCase {
  execute(params: UpsertMembershipRequest): Promise<UpsertMembershipResponse>;
}

export class upsertMembershipUseCase implements IUpsertMembershipUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(params: UpsertMembershipRequest): Promise<UpsertMembershipResponse> {
    return this.membershipRepository.upsertMembership(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), upsertMembershipUseCase);

// Create a factory function
export const createUpsertMembershipUseCase = (
  membershipRepository: IMembershipRepository,
): IUpsertMembershipUseCase => {
  return new upsertMembershipUseCase(membershipRepository);
};
