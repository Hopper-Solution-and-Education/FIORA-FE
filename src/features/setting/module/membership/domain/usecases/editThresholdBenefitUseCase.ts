import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { EditThresholdBenefitRequest, EditThresholdBenefitResponse } from '../entities';

export interface IEditThresholdBenefitUseCase {
  execute(params: EditThresholdBenefitRequest): Promise<EditThresholdBenefitResponse>;
}

export class editThresholdBenefitUseCase implements IEditThresholdBenefitUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(params: EditThresholdBenefitRequest): Promise<EditThresholdBenefitResponse> {
    return this.membershipRepository.editThresholdBenefit(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), editThresholdBenefitUseCase);

// Create a factory function
export const createEditThresholdBenefitUseCase = (
  membershipRepository: IMembershipRepository,
): IEditThresholdBenefitUseCase => {
  return new editThresholdBenefitUseCase(membershipRepository);
};
