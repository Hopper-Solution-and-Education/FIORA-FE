import { IPartnerAPI } from '../api/partnerApi';
import { Partner } from '../../domain/entities/Partner';
import { PartnerMapper } from '../mapper/PartnerMapper';
import { GetPartnerAPIRequestDTO } from '../dto/request/GetPartnerAPIRequestDTO';
import { CreatePartnerAPIRequestDTO } from '../dto/request/CreatePartnerAPIRequestDTO';
import { UpdatePartnerAPIRequestDTO } from '../dto/request/UpdatePartnerAPIRequestDTO';

export interface IPartnerRepository {
  getPartners(data: GetPartnerAPIRequestDTO): Promise<Partner[]>;
  createPartner(data: CreatePartnerAPIRequestDTO): Promise<Partner>;
  updatePartner(data: UpdatePartnerAPIRequestDTO): Promise<Partner>;
}

export const createPartnerRepository = (api: IPartnerAPI): IPartnerRepository => ({
  async getPartners(data: GetPartnerAPIRequestDTO): Promise<Partner[]> {
    const response = await api.getPartners(data);
    return PartnerMapper.toEntityListFromGet(response);
  },

  async createPartner(data: CreatePartnerAPIRequestDTO): Promise<Partner> {
    const response = await api.createPartner(data);
    console.log('Response: {}', response.message);

    return PartnerMapper.toEntityFromCreate(response);
  },

  async updatePartner(data: UpdatePartnerAPIRequestDTO): Promise<Partner> {
    const response = await api.updatePartner(data);
    return PartnerMapper.toEntityFromCreate(response); // Giả định response tương tự create
  },
});
