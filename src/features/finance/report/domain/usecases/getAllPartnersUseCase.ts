import { decorate, injectable } from 'inversify';
import { IPartnerRepository } from '../../data/repositories';
import { GetListPartnerRequest, GetListPartnerResponse } from '../entities';

export interface IGetAllPartnerUseCase {
  execute(params: GetListPartnerRequest): Promise<GetListPartnerResponse>;
}

export class getAllPartnersUseCase implements IGetAllPartnerUseCase {
  private partnerRepository: IPartnerRepository;

  constructor(partnerRepository: IPartnerRepository) {
    this.partnerRepository = partnerRepository;
  }

  execute(params: GetListPartnerRequest): Promise<GetListPartnerResponse> {
    return this.partnerRepository.getListPartner(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), getAllPartnersUseCase);

// Create a factory function
export const createGetAllPartnersUseCase = (
  partnerRepository: IPartnerRepository,
): IGetAllPartnerUseCase => {
  return new getAllPartnersUseCase(partnerRepository);
};
