import { IPartnerRepository } from '../../data/repositories/PartnerRepository';
import { Partner } from '../entities/Partner';

export interface IGetPartnerByIdUseCase {
  execute(id: string): Promise<Partner>;
}

export const createGetPartnerByIdUseCase = (
  repository: IPartnerRepository,
): IGetPartnerByIdUseCase => ({
  async execute(id: string): Promise<Partner> {
    return repository.getPartnerById(id);
  },
});
