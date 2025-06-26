import { decorate, injectable } from 'inversify';
import { IMembershipRepository } from '../../data/repositories';
import { GetCurrentTierResponse } from '../entities';

export interface IGetCurrentTierUseCase {
  execute(): Promise<GetCurrentTierResponse>;
}

export class getCurrentTierUseCase implements IGetCurrentTierUseCase {
  private membershipRepository: IMembershipRepository;

  constructor(membershipRepository: IMembershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  execute(): Promise<GetCurrentTierResponse> {
    return this.membershipRepository.getCurrentTier();
  }
}

// Apply decorators programmatically
decorate(injectable(), getCurrentTierUseCase);

// Create a factory function
export const createGetCurrentTierUseCase = (
  membershipRepository: IMembershipRepository,
): IGetCurrentTierUseCase => {
  return new getCurrentTierUseCase(membershipRepository);
};
