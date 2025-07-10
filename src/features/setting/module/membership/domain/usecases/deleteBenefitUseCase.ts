import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { DeleteBenefitTierRequest, DeleteBenefitTierResponse } from '../entities';

export interface IDeleteBenefitUseCase {
  execute(params: DeleteBenefitTierRequest): Promise<DeleteBenefitTierResponse>;
}

export class deleteBenefitUseCase implements IDeleteBenefitUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(params: DeleteBenefitTierRequest): Promise<DeleteBenefitTierResponse> {
    return this.membershipRepository.deleteBenefitTier(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), deleteBenefitUseCase);

// Create a factory function
export const createDeleteBenefitUseCase = (
  membershipRepository: IMembershipRepository,
): IDeleteBenefitUseCase => {
  return new deleteBenefitUseCase(membershipRepository);
};
