import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import {
  GetListMembershipsRequestDTO,
  GetListMembershipsResponseDTO,
  UpsertMembershipRequestDTO,
  UpsertMembershipResponseDTO,
} from '../dto';

export interface IMembershipAPI {
  getListMemberships(request: GetListMembershipsRequestDTO): Promise<GetListMembershipsResponseDTO>;
  upsertMembership(request: UpsertMembershipRequestDTO): Promise<UpsertMembershipResponseDTO>;
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
    return await httpClient.put(`/api/memberships/${request.id}`, {
      ...request,
      id: undefined,
    });
  }
}

// Apply decorators programmatically
decorate(injectable(), MembershipAPI);

// Create a factory function
export const createMembershipAPI = (): IMembershipAPI => {
  return new MembershipAPI();
};

export { MembershipAPI };
