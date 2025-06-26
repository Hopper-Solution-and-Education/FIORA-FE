import { decorate, injectable } from 'inversify';
import {
  GetCurrentTierResponse,
  GetListMembershipsRequest,
  GetListMembershipsResponse,
} from '../../domain/entities';
import { IMembershipAPI } from '../api';
import { MemberMapper } from '../mapper';

export interface IMembershipRepository {
  getListMemberships(request: GetListMembershipsRequest): Promise<GetListMembershipsResponse>;
  getCurrentTier(): Promise<GetCurrentTierResponse>;
}

export class MembershipRepository implements IMembershipRepository {
  constructor(private readonly membershipAPI: IMembershipAPI) {}

  async getListMemberships(
    request: GetListMembershipsRequest,
  ): Promise<GetListMembershipsResponse> {
    const requestDTO = MemberMapper.toGetListMembershipsRequest(request);
    const response = await this.membershipAPI.getListMemberships(requestDTO);
    return MemberMapper.toGetListMembershipsResponse(response);
  }

  async getCurrentTier(): Promise<GetCurrentTierResponse> {
    const response = await this.membershipAPI.getCurrentTier();
    return MemberMapper.toGetCurrentTierResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), MembershipRepository);

// Create a factory function
export const createMembershipRepository = (
  membershipAPI: IMembershipAPI,
): IMembershipRepository => {
  return new MembershipRepository(membershipAPI);
};
