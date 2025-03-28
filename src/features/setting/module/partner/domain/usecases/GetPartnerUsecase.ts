import { IPartnerRepository } from '../../data/repositories/PartnerRepository';
import { Partner } from '../entities/Partner';
import { GetPartnerAPIRequestDTO } from '../../data/dto/request/GetPartnerAPIRequestDTO';

export interface IGetPartnerUseCase {
  execute(data: GetPartnerAPIRequestDTO): Promise<Partner[]>;
}

export const createGetPartnerUseCase = (repository: IPartnerRepository): IGetPartnerUseCase => ({
  async execute(data: GetPartnerAPIRequestDTO): Promise<Partner[]> {
    return repository.getPartners(data);
  },
});
