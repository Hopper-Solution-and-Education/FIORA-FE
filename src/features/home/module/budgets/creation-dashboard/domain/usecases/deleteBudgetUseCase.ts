import { decorate, injectable } from 'inversify';
import { IBudgetRepository } from '../../data/repositories';
import { BudgetDeleteRequest, BudgetDeleteResponse } from '../entities/Budget';

export interface IDeleteBudgetUseCase {
  execute(params: BudgetDeleteRequest): Promise<BudgetDeleteResponse>;
}

export class DeleteBudgetUseCase implements IDeleteBudgetUseCase {
  private budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  execute(params: BudgetDeleteRequest): Promise<BudgetDeleteResponse> {
    return this.budgetRepository.deleteBudget(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), DeleteBudgetUseCase);

// Create a factory function
export const createDeleteBudgetUseCase = (
  budgetRepository: IBudgetRepository,
): IDeleteBudgetUseCase => {
  return new DeleteBudgetUseCase(budgetRepository);
};
