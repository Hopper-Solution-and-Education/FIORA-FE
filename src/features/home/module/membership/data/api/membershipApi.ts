import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { GetListMembershipsRequestDTO, GetListMembershipsResponseDTO } from '../dto';

export interface IMembershipAPI {
  getListMemberships(request: GetListMembershipsRequestDTO): Promise<GetListMembershipsResponseDTO>;
}

class MembershipAPI implements IMembershipAPI {
  async getListMemberships(
    request: GetListMembershipsRequestDTO,
  ): Promise<GetListMembershipsResponseDTO> {
    console.log(request);
    return await httpClient.get('/api/memberships');
  }
}

// Apply decorators programmatically
decorate(injectable(), MembershipAPI);

// Create a factory function
export const createMembershipAPI = (): IMembershipAPI => {
  return new MembershipAPI();
};

export { MembershipAPI };
