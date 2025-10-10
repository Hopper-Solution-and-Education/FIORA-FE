import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import {
  getCurrentTierResponseDTO,
  GetListMembershipsRequestDTO,
  GetListMembershipsResponseDTO,
} from '../dto';

export interface IMembershipAPI {
  getListMemberships(request: GetListMembershipsRequestDTO): Promise<GetListMembershipsResponseDTO>;
  getCurrentTier(): Promise<getCurrentTierResponseDTO>;
}

class MembershipAPI implements IMembershipAPI {
  async getListMemberships(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GetListMembershipsRequestDTO,
  ): Promise<GetListMembershipsResponseDTO> {
    return await httpClient.get('/api/memberships');
  }

  async getCurrentTier(): Promise<getCurrentTierResponseDTO> {
    return await httpClient.get('/api/memberships/current-tier');
  }
}

// Apply decorators programmatically
decorate(injectable(), MembershipAPI);

// Create a factory function
export const createMembershipAPI = (): IMembershipAPI => {
  return new MembershipAPI();
};

export { MembershipAPI };
