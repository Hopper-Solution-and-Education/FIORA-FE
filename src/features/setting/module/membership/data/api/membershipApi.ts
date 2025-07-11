import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import {
  AddBenefitTierRequestDTO,
  AddBenefitTierResponseDTO,
  DeleteBenefitTierRequestDTO,
  DeleteBenefitTierResponseDTO,
  GetListMembershipsRequestDTO,
  GetListMembershipsResponseDTO,
  UpsertMembershipRequestDTO,
  UpsertMembershipResponseDTO,
} from '../dto';

export interface IMembershipAPI {
  getListMemberships(request: GetListMembershipsRequestDTO): Promise<GetListMembershipsResponseDTO>;
  upsertMembership(request: UpsertMembershipRequestDTO): Promise<UpsertMembershipResponseDTO>;
  addBenefitTier(request: AddBenefitTierRequestDTO): Promise<AddBenefitTierResponseDTO>;
  deleteBenefitTier(request: DeleteBenefitTierRequestDTO): Promise<DeleteBenefitTierResponseDTO>;
}

class MembershipAPI implements IMembershipAPI {
  async getListMemberships(
    request: GetListMembershipsRequestDTO,
  ): Promise<GetListMembershipsResponseDTO> {
    console.log(request);
    return await httpClient.get('/api/memberships');
  }

  async upsertMembership(
    request: UpsertMembershipRequestDTO,
  ): Promise<UpsertMembershipResponseDTO> {
    return await httpClient.put(`/api/memberships`, request);
  }

  async addBenefitTier(request: AddBenefitTierRequestDTO): Promise<AddBenefitTierResponseDTO> {
    return await httpClient.post('/api/memberships/benefit', request);
  }

  async deleteBenefitTier(
    request: DeleteBenefitTierRequestDTO,
  ): Promise<DeleteBenefitTierResponseDTO> {
    return await httpClient.delete(`/api/memberships/benefit?id=${request.id}`);
  }
}

// Apply decorators programmatically
decorate(injectable(), MembershipAPI);

// Create a factory function
export const createMembershipAPI = (): IMembershipAPI => {
  return new MembershipAPI();
};

export { MembershipAPI };
