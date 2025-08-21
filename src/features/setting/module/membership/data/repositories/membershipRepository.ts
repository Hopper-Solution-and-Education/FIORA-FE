import { decorate, injectable } from 'inversify';
import {
  AddUpdateBenefitTierRequest,
  AddUpdateBenefitTierResponse,
  DeleteBenefitTierRequest,
  DeleteBenefitTierResponse,
  EditThresholdBenefitRequest,
  EditThresholdBenefitResponse,
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
  addBenefitTier(request: AddUpdateBenefitTierRequest): Promise<AddUpdateBenefitTierResponse>;
  deleteBenefitTier(request: DeleteBenefitTierRequest): Promise<DeleteBenefitTierResponse>;
  editThresholdBenefit(request: EditThresholdBenefitRequest): Promise<EditThresholdBenefitResponse>;
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

  async addBenefitTier(
    request: AddUpdateBenefitTierRequest,
  ): Promise<AddUpdateBenefitTierResponse> {
    const requestDTO = MemberMapper.toAddBenefitTierRequest(request);
    const response = await this.membershipAPI.addUpdateBenefitTier(requestDTO);
    return MemberMapper.toAddBenefitTierResponse(response);
  }

  async deleteBenefitTier(request: DeleteBenefitTierRequest): Promise<DeleteBenefitTierResponse> {
    const requestDTO = MemberMapper.toDeleteBenefitTierRequest(request);
    const response = await this.membershipAPI.deleteBenefitTier(requestDTO);
    return MemberMapper.toDeleteBenefitTierResponse(response);
  }

  async editThresholdBenefit(
    request: EditThresholdBenefitRequest,
  ): Promise<EditThresholdBenefitResponse> {
    const requestDTO = MemberMapper.toEditThresholdBenefitRequest(request);
    const response = await this.membershipAPI.editThresholdBenefit(requestDTO);
    return MemberMapper.toEditThresholdBenefitResponse(response);
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
