import { Container } from 'inversify';
import { TYPES } from './budgetSummaryDIContainer.type';
import { BudgetSummaryRepository } from '../data/repositories/budgetSummaryRepository';
import { BudgetSummaryAPI } from '../data/api/budgetSummaryApi';
import { IBudgetSummaryRepository } from '../data/repositories/IBudgetSummaryRepository';
import { IBudgetSummaryAPI } from '../data/api/IBudgetSummaryAPI';
import { BudgetSummaryUsecase } from '../domain/usecases/BudgetSummaryUsecase';
import { IBudgetSummaryUseCase } from '../domain/usecases/IBudgetSummaryUseCase';

const budgetSummaryDIContainer = new Container();

// API
budgetSummaryDIContainer
  .bind<IBudgetSummaryAPI>(TYPES.IBudgetSummaryAPI)
  .to(BudgetSummaryAPI)
  .inSingletonScope();

// Repository
budgetSummaryDIContainer
  .bind<IBudgetSummaryRepository>(TYPES.IBudgetSummaryRepository)
  .to(BudgetSummaryRepository)
  .inSingletonScope();

// Use Case
budgetSummaryDIContainer
  .bind<IBudgetSummaryUseCase>(TYPES.IBudgetSummaryUseCase)
  .to(BudgetSummaryUsecase)
  .inSingletonScope();

export { budgetSummaryDIContainer };
