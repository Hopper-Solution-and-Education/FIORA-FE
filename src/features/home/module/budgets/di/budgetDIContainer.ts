import { Container } from 'inversify';
import { createBudgetAPI, IBudgetAPI } from '../data/api';
import { createBudgetRepository, IBudgetRepository } from '../data/repositories';
import { createCreateBudgetUseCase, ICreateBudgetUseCase } from '../domain/usecases';
import { TYPES } from './budgetDIContainer.type';

const productDIContainer = new Container();

// Create API instances
const budgetAPI = createBudgetAPI();

// Create repository instances
const categoryRepository = createBudgetRepository(budgetAPI);

// Create use case instances
const createBudgetUseCase = createCreateBudgetUseCase(categoryRepository);

// Bind all instances
productDIContainer.bind<IBudgetAPI>(TYPES.IBudgetAPI).toConstantValue(budgetAPI);
productDIContainer
  .bind<IBudgetRepository>(TYPES.IBudgetRepository)
  .toConstantValue(categoryRepository);
productDIContainer
  .bind<ICreateBudgetUseCase>(TYPES.ICreateBudgetUseCase)
  .toConstantValue(createBudgetUseCase);

export { productDIContainer };
