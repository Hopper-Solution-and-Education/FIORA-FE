import { decorate, injectable } from 'inversify';
import { IBudgetRepository } from '../../data/repositories';
import { BudgetCreateRequest, BudgetCreateResponse } from '../entities/Budget';

export interface ICreateBudgetUseCase {
  execute(params: BudgetCreateRequest): Promise<BudgetCreateResponse>;
}

export class CreateBudgetUseCase implements ICreateBudgetUseCase {
  private budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  execute(params: BudgetCreateRequest): Promise<BudgetCreateResponse> {
    return this.budgetRepository.createBudget(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), CreateBudgetUseCase);

// Create a factory function
export const createCreateBudgetUseCase = (
  budgetRepository: IBudgetRepository,
): ICreateBudgetUseCase => {
  return new CreateBudgetUseCase(budgetRepository);
};
