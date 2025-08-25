import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { AddUpdateBenefitTierRequest, AddUpdateBenefitTierResponse } from '../entities';

export interface IAddNewBenefitUseCase {
  execute(params: AddUpdateBenefitTierRequest): Promise<AddUpdateBenefitTierResponse>;
}

export class addNewBenefitUseCase implements IAddNewBenefitUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(params: AddUpdateBenefitTierRequest): Promise<AddUpdateBenefitTierResponse> {
    return this.membershipRepository.addBenefitTier(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), addNewBenefitUseCase);

// Create a factory function
export const createAddNewBenefitUseCase = (
  membershipRepository: IMembershipRepository,
): IAddNewBenefitUseCase => {
  return new addNewBenefitUseCase(membershipRepository);
};
