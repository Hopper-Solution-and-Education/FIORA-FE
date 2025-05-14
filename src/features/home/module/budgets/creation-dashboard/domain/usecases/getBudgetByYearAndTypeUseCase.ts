import { decorate, injectable } from 'inversify';
import { IBudgetRepository } from '../../data/repositories';
import { BudgetGetByYearAndTypeRequest, BudgetGetByYearAndTypeResponse } from '../entities/Budget';

export interface IGetBudgetByYearAndTypeUseCase {
  execute(params: BudgetGetByYearAndTypeRequest): Promise<BudgetGetByYearAndTypeResponse>;
}

export class GetBudgetByYearAndTypeUseCase implements IGetBudgetByYearAndTypeUseCase {
  private budgetRepository: IBudgetRepository;

  constructor(budgetRepository: IBudgetRepository) {
    this.budgetRepository = budgetRepository;
  }

  execute(params: BudgetGetByYearAndTypeRequest): Promise<BudgetGetByYearAndTypeResponse> {
    return this.budgetRepository.getBudgetByYearAndType(params);
  }
}

// Apply decorators programmatically
decorate(injectable(), GetBudgetByYearAndTypeUseCase);

// Create a factory function
export const createGetBudgetByYearAndTypeUseCase = (
  budgetRepository: IBudgetRepository,
): IGetBudgetByYearAndTypeUseCase => {
  return new GetBudgetByYearAndTypeUseCase(budgetRepository);
};
