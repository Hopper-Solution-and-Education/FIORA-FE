import { Container } from 'inversify';
import { createBudgetAPI, IBudgetAPI } from '../data/api';
import { createBudgetRepository, IBudgetRepository } from '../data/repositories';
import {
  createCreateBudgetUseCase,
  createGetBudgetByIdUseCase,
  createGetBudgetUseCase,
  ICreateBudgetUseCase,
  IGetBudgetByIdUseCase,
  IGetBudgetUseCase,
} from '../domain/usecases';
import { TYPES } from './budgetDIContainer.type';

const budgetDIContainer = new Container();

// Create API instances
const budgetAPI = createBudgetAPI();

// Create repository instances
const categoryRepository = createBudgetRepository(budgetAPI);

// Create use case instances
const createBudgetUseCase = createCreateBudgetUseCase(categoryRepository);

// create get use cases
const getBudgetUseCase = createGetBudgetUseCase(categoryRepository);

// create get budget by id use case
const getBudgetByIdUseCase = createGetBudgetByIdUseCase(categoryRepository);

// Bind all instances
budgetDIContainer.bind<IBudgetAPI>(TYPES.IBudgetAPI).toConstantValue(budgetAPI);
budgetDIContainer
  .bind<IBudgetRepository>(TYPES.IBudgetRepository)
  .toConstantValue(categoryRepository);
budgetDIContainer
  .bind<ICreateBudgetUseCase>(TYPES.ICreateBudgetUseCase)
  .toConstantValue(createBudgetUseCase);
budgetDIContainer
  .bind<IGetBudgetUseCase>(TYPES.IGetBudgetUseCase)
  .toConstantValue(getBudgetUseCase);
budgetDIContainer
  .bind<IGetBudgetByIdUseCase>(TYPES.IGetBudgetByIdUseCase)
  .toConstantValue(getBudgetByIdUseCase);

export { budgetDIContainer };
