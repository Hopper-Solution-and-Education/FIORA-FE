import { httpClient } from '@/config/HttpClient';
import { decorate, injectable } from 'inversify';
import { CreatePartnerAPIRequestDTO } from '../dto/request/CreatePartnerAPIRequestDTO';
import { GetPartnerAPIRequestDTO } from '../dto/request/GetPartnerAPIRequestDTO';
import { UpdatePartnerAPIRequestDTO } from '../dto/request/UpdatePartnerAPIRequestDTO';
import { CreatePartnerAPIResponseDTO } from '../dto/response/CreatePartnerAPIResponseDTO';
import { GetPartnerAPIResponseDTO } from '../dto/response/GetPartnerAPIResponseDTO';
import { GetPartnerByIdAPIResponseDTO } from '../dto/response/GetPartnerByIdAPIResponseDTO';
import { UpdatePartnerAPIResponseDTO } from '../dto/response/UpdatePartnerAPIResponseDTO';
import { DeletePartnerAPIResponseDTO } from '../dto/response/DeletePartnerAPIResponseDTO';

interface IPartnerAPI {
  createPartner(data: CreatePartnerAPIRequestDTO): Promise<CreatePartnerAPIResponseDTO>;
  getPartners(data: GetPartnerAPIRequestDTO): Promise<GetPartnerAPIResponseDTO>;
  getPartnerById(id: string): Promise<GetPartnerByIdAPIResponseDTO>;
  updatePartner(data: UpdatePartnerAPIRequestDTO): Promise<UpdatePartnerAPIResponseDTO>;
  deletePartner(id: string): Promise<DeletePartnerAPIResponseDTO>; // Add this method
}

class PartnerAPI implements IPartnerAPI {
  async createPartner(data: CreatePartnerAPIRequestDTO) {
    const response = await httpClient.post<CreatePartnerAPIResponseDTO>('/api/partners', data);
    console.log(response);
    return response;
  }

  async getPartners(data: GetPartnerAPIRequestDTO) {
    return await httpClient.get<GetPartnerAPIResponseDTO>(
      `/api/partners?page=${data.page}&pageSize=${data.pageSize}`,
    );
  }

  async getPartnerById(id: string) {
    return await httpClient.get<GetPartnerByIdAPIResponseDTO>(`/api/partners/${id}`);
  }

  async updatePartner(data: UpdatePartnerAPIRequestDTO) {
    return await httpClient.put<UpdatePartnerAPIResponseDTO>(`/api/partners/${data.id}`, data);
  }

  async deletePartner(id: string) {
    return await httpClient.delete<DeletePartnerAPIResponseDTO>(`/api/partners/${id}`);
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
