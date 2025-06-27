import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { GetListMembershipsRequest, GetListMembershipsResponse } from '../entities';

export interface IGetListMembershipUseCase {
  execute(params: GetListMembershipsRequest): Promise<GetListMembershipsResponse>;
}

export class getListMembershipUseCase implements IGetListMembershipUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(params: GetListMembershipsRequest): Promise<GetListMembershipsResponse> {
    return this.membershipRepository.getListMemberships(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), getListMembershipUseCase);

// Create a factory function
export const createGetListMembershipUseCase = (
  membershipRepository: IMembershipRepository,
): IGetListMembershipUseCase => {
  return new getListMembershipUseCase(membershipRepository);
};
