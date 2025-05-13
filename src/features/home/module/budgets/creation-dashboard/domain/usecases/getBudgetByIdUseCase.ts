import { decorate, injectable } from 'inversify';
import { IBudgetRepository } from '../../data/repositories';
import { BudgetGetByIdRequest, BudgetGetByIdResponse } from '../entities/Budget';

export interface IGetBudgetByIdUseCase {
  execute(params: BudgetGetByIdRequest): Promise<BudgetGetByIdResponse>;
}

export class GetBudgetByIdUseCase implements IGetBudgetByIdUseCase {
  private budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  execute(params: BudgetGetByIdRequest): Promise<BudgetGetByIdResponse> {
    return this.budgetRepository.getBudgetById(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetBudgetByIdUseCase);

// Create a factory function
export const createGetBudgetByIdUseCase = (
  budgetRepository: IBudgetRepository,
): IGetBudgetByIdUseCase => {
  return new GetBudgetByIdUseCase(budgetRepository);
};
