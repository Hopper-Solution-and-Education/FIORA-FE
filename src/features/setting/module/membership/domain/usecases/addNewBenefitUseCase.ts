import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { AddBenefitTierRequest, AddBenefitTierResponse } from '../entities';

export interface IAddNewBenefitUseCase {
  execute(params: AddBenefitTierRequest): Promise<AddBenefitTierResponse>;
}

export class addNewBenefitUseCase implements IAddNewBenefitUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(params: AddBenefitTierRequest): Promise<AddBenefitTierResponse> {
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
