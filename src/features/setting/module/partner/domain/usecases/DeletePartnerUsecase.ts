import { Partner } from '../entities/Partner';
import { IPartnerRepository } from '../../data/repositories/PartnerRepository';

export interface IDeletePartnerUseCase {
  execute(id: string): Promise<Partner>;
}

export class DeletePartnerUseCase implements IDeletePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(id: string): Promise<Partner> {
    return await this.partnerRepository.deletePartner(id);
  }
}

// Add a factory function to create the use case
export const createDeletePartnerUseCase = (
  partnerRepository: IPartnerRepository,
): IDeletePartnerUseCase => {
  return new DeletePartnerUseCase(partnerRepository);
};
