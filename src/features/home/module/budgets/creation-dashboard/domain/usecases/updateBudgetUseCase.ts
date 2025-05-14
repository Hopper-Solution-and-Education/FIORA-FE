import { decorate, injectable } from 'inversify';
import { IBudgetRepository } from '../../data/repositories';
import { BudgetUpdateRequest, BudgetUpdateResponse } from '../entities/Budget';

export interface IUpdateBudgetUseCase {
  execute(params: BudgetUpdateRequest): Promise<BudgetUpdateResponse>;
}

export class UpdateBudgetUseCase implements IUpdateBudgetUseCase {
  private budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  execute(params: BudgetUpdateRequest): Promise<BudgetUpdateResponse> {
    return this.budgetRepository.updateBudget(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), UpdateBudgetUseCase);

// Create a factory function
export const createUpdateBudgetUseCase = (
  budgetRepository: IBudgetRepository,
): IUpdateBudgetUseCase => {
  return new UpdateBudgetUseCase(budgetRepository);
};
