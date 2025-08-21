import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import {
  AddUpdateBenefitTierRequestDTO,
  AddUpdateBenefitTierResponseDTO,
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
  addUpdateBenefitTier(
    request: AddUpdateBenefitTierRequestDTO,
  ): Promise<AddUpdateBenefitTierResponseDTO>;
  deleteBenefitTier(request: DeleteBenefitTierRequestDTO): Promise<DeleteBenefitTierResponseDTO>;
}

export enum ProcessMembershipMode {
  CREATE = 'create',
  CREATE_ALL = 'create-all',
  UPDATE = 'update',
  UPDATE_ALL = 'update-all',
  DELETE = 'delete',
  DELETE_ALL = 'delete-all',
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

  async addUpdateBenefitTier(
    request: AddUpdateBenefitTierRequestDTO,
  ): Promise<AddUpdateBenefitTierResponseDTO> {
    return await httpClient.post('/api/memberships/benefit', request);
  }

  async deleteBenefitTier(
    request: DeleteBenefitTierRequestDTO,
  ): Promise<DeleteBenefitTierResponseDTO> {
    return await httpClient.post('/api/memberships/benefit', request);
  }
}

// Apply decorators programmatically
decorate(injectable(), MembershipAPI);

// Create a factory function
export const createMembershipAPI = (): IMembershipAPI => {
  return new MembershipAPI();
};

export { MembershipAPI };
