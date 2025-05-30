import { IPartnerAPI } from '../api/partnerApi';
import { Partner } from '../../domain/entities/Partner';
import { PartnerMapper } from '../mapper/PartnerMapper';
import { GetPartnerAPIRequestDTO } from '../dto/request/GetPartnerAPIRequestDTO';
import { CreatePartnerAPIRequestDTO } from '../dto/request/CreatePartnerAPIRequestDTO';
import { UpdatePartnerAPIRequestDTO } from '../dto/request/UpdatePartnerAPIRequestDTO';
import { Response } from '@/shared/types/Common.types';
import { PartnerResponse } from '../../slices/types';

// In the IPartnerRepository interface
export interface IPartnerRepository {
  getPartners(data: GetPartnerAPIRequestDTO): Promise<Response<PartnerResponse>>;
  getPartnerById(id: string): Promise<Partner>;
  createPartner(data: CreatePartnerAPIRequestDTO): Promise<Partner>;
  updatePartner(data: UpdatePartnerAPIRequestDTO): Promise<Partner>;
  deletePartner(id: string, replacementId?: string | null): Promise<void>;
}

// In the implementation
export const createPartnerRepository = (api: IPartnerAPI): IPartnerRepository => ({
  async getPartners(data: GetPartnerAPIRequestDTO): Promise<Response<PartnerResponse>> {
    const response = await api.getPartners(data);
    return {
      status: response.status,
      message: response.message,
      data: {
        data: PartnerMapper.toEntityListFromGet(response),
        minIncome: response.data.minIncome,
        maxIncome: response.data.maxIncome,
        minExpense: response.data.minExpense,
        maxExpense: response.data.maxExpense,
      },
    };
  },

  async getPartnerById(id: string): Promise<Partner> {
    const response = await api.getPartnerById(id);
    return PartnerMapper.toEntityFromGetById(response);
  },

  async createPartner(data: CreatePartnerAPIRequestDTO): Promise<Partner> {
    const response = await api.createPartner(data);

    return PartnerMapper.toEntityFromCreate(response);
  },

  async updatePartner(data: UpdatePartnerAPIRequestDTO): Promise<Partner> {
    const response = await api.updatePartner(data);
    return PartnerMapper.toEntityFromCreate(response); // Giả định response tương tự create
  },

  async deletePartner(id: string, replacementId?: string | null): Promise<void> {
    try {
      // API only returns status and message
      await api.deletePartner(id, replacementId);
    } catch (error) {
      console.error('Error in PartnerRepository.deletePartner:', error);
      throw error;
    }
  },
});
