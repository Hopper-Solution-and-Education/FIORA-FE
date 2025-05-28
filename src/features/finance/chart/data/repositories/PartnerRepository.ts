import { decorate, injectable } from 'inversify';
import { GetListPartnerRequest, GetListPartnerResponse } from '../../domain/entities';
import { IPartnerAPI } from '../api';
import { PartnerMapper } from '../mapper';

export interface IPartnerRepository {
  getListPartner(request: GetListPartnerRequest): Promise<GetListPartnerResponse>;
}

export class PartnerRepository implements IPartnerRepository {
  private partnerAPI: IPartnerAPI;

  constructor(partnerAPI: IPartnerAPI) {
    this.partnerAPI = partnerAPI;
  }

  async getListPartner(request: GetListPartnerRequest): Promise<GetListPartnerResponse> {
    const requestAPI = PartnerMapper.toGetListPartnerRequestDTO(request);
    const response = await this.partnerAPI.getListPartners(requestAPI);
    return PartnerMapper.toGetListPartnerResponse(response);
  }
}

// Apply decorators programmatically
decorate(injectable(), PartnerRepository);

// Create a factory function
export const createPartnerRepository = (partnerAPI: IPartnerAPI): IPartnerRepository => {
  return new PartnerRepository(partnerAPI);
};
