import { IPartnerRepository } from '../../data/repositories/PartnerRepository';
import { Partner } from '../entities/Partner';
import { CreatePartnerAPIRequestDTO } from '../../data/dto/request/CreatePartnerAPIRequestDTO';

export interface ICreatePartnerUseCase {
  execute(data: CreatePartnerAPIRequestDTO): Promise<Partner>;
}

export const createCreatePartnerUseCase = (
  repository: IPartnerRepository,
): ICreatePartnerUseCase => ({
  async execute(data: CreatePartnerAPIRequestDTO): Promise<Partner> {
    return repository.createPartner(data);
  },
});
