// src/features/setting/module/partner/data/api/partnerApi.ts
import { httpClient } from '@/config/HttpClient';
import { decorate, injectable } from 'inversify';
import { CreatePartnerAPIRequestDTO } from '../dto/request/CreatePartnerAPIRequestDTO';
import { GetPartnerAPIRequestDTO } from '../dto/request/GetPartnerAPIRequestDTO';
import { UpdatePartnerAPIRequestDTO } from '../dto/request/UpdatePartnerAPIRequestDTO';
import { CreatePartnerAPIResponseDTO } from '../dto/response/CreatePartnerAPIResponseDTO';
import { GetPartnerAPIResponseDTO } from '../dto/response/GetPartnerAPIResponseDTO';
import { UpdatePartnerAPIResponseDTO } from '../dto/response/UpdatePartnerAPIResponseDTO';

interface IPartnerAPI {
  createPartner(data: CreatePartnerAPIRequestDTO): Promise<CreatePartnerAPIResponseDTO>;
  getPartners(data: GetPartnerAPIRequestDTO): Promise<GetPartnerAPIResponseDTO>;
  updatePartner(data: UpdatePartnerAPIRequestDTO): Promise<UpdatePartnerAPIResponseDTO>;
}

class PartnerAPI implements IPartnerAPI {
  async createPartner(data: CreatePartnerAPIRequestDTO) {
    const response = await httpClient.post<CreatePartnerAPIResponseDTO>(
      '/api/partners/partner',
      data,
    );
    console.log(response);
    return response;
  }

  async getPartners(data: GetPartnerAPIRequestDTO) {
    return await httpClient.get<GetPartnerAPIResponseDTO>(
      `/api/partners/partner?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }

  async updatePartner(data: UpdatePartnerAPIRequestDTO) {
    return await httpClient.put<UpdatePartnerAPIResponseDTO>(`/api/partners/partner`, data);
  }
}

// Apply decorators programmatically
decorate(injectable(), PartnerAPI);

// Create a factory function
export const createPartnerAPI = (): IPartnerAPI => {
  return new PartnerAPI();
};

export { PartnerAPI };
export type { IPartnerAPI };
