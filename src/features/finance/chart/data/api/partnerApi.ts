import { httpClient } from '@/config/http-client/HttpClient';
import { decorate, injectable } from 'inversify';
import { GetListPartnersRequestDTO, GetListPartnersResponseDTO } from '../dto';

export interface IPartnerAPI {
  getListPartners(request: GetListPartnersRequestDTO): Promise<GetListPartnersResponseDTO>;
}

class PartnerAPI implements IPartnerAPI {
  async getListPartners(data: GetListPartnersRequestDTO) {
    return await httpClient.get<GetListPartnersResponseDTO>(
      `/api/partners?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }
}

// Apply decorators programmatically
decorate(injectable(), PartnerAPI);

// Create a factory function
export const createPartnerAPI = (): IPartnerAPI => {
  return new PartnerAPI();
};

export { PartnerAPI };
