import budgetSummaryRepository from '../data/repositories/budgetSummaryRepository';
import { GetBudgetSummaryUseCase } from '../domain/usecases/getBudgetSummaryUseCase';

export const provideBudgetSummaryUseCase = () => {
  return new GetBudgetSummaryUseCase(budgetSummaryRepository);
};
