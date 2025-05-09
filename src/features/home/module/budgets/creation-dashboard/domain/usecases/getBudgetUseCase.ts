import { decorate, injectable } from 'inversify';
import { IBudgetRepository } from '../../data/repositories';
import { BudgetGetRequest, BudgetGetResponse } from '../entities/Budget';

export interface IGetBudgetUseCase {
  execute(params: BudgetGetRequest): Promise<BudgetGetResponse>;
}

export class GetBudgetUseCase implements IGetBudgetUseCase {
  private budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  execute(params: BudgetGetRequest): Promise<BudgetGetResponse> {
    return this.budgetRepository.getBudget(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetBudgetUseCase);

// Create a factory function
export const createGetBudgetUseCase = (budgetRepository: IBudgetRepository): IGetBudgetUseCase => {
  return new GetBudgetUseCase(budgetRepository);
};
