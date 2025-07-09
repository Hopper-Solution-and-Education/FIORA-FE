import { decorate, injectable } from 'inversify';
import {
  AddBenefitTierRequest,
  AddBenefitTierResponse,
  GetListMembershipsRequest,
  GetListMembershipsResponse,
  UpsertMembershipRequest,
  UpsertMembershipResponse,
} from '../../domain/entities';
import { IMembershipAPI } from '../api';
import { MemberMapper } from '../mapper';

export interface IMembershipRepository {
  getListMemberships(request: GetListMembershipsRequest): Promise<GetListMembershipsResponse>;
  upsertMembership(request: UpsertMembershipRequest): Promise<UpsertMembershipResponse>;
  addBenefitTier(request: AddBenefitTierRequest): Promise<AddBenefitTierResponse>;
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

  async upsertMembership(request: UpsertMembershipRequest): Promise<UpsertMembershipResponse> {
    const requestDTO = MemberMapper.toUpsertMembershipRequest(request);
    const response = await this.membershipAPI.upsertMembership(requestDTO);
    return MemberMapper.toUpsertMembershipResponse(response);
  }

  async addBenefitTier(request: AddBenefitTierRequest): Promise<AddBenefitTierResponse> {
    const requestDTO = MemberMapper.toAddBenefitTierRequest(request);
    const response = await this.membershipAPI.addBenefitTier(requestDTO);
    return MemberMapper.toAddBenefitTierResponse(response);
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
