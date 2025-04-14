import { IPartnerRepository } from '../../data/repositories/PartnerRepository';

export interface IDeletePartnerUseCase {
  execute(id: string, replacementId?: string | null): Promise<void>;
}

export class DeletePartnerUseCase implements IDeletePartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async execute(id: string, replacementId?: string | null): Promise<void> {
    try {
      // The API only returns status and message, not the partner object
      await this.partnerRepository.deletePartner(id, replacementId);
    } catch (error) {
      console.error('Error in DeletePartnerUseCase:', error);
      throw error;
    }
  }
}

export const createDeletePartnerUseCase = (
  partnerRepository: IPartnerRepository,
): IDeletePartnerUseCase => {
  return new DeletePartnerUseCase(partnerRepository);
};
