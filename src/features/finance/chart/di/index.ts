import { Container } from 'inversify';
import { createFinanceAPI, IFinanceAPI } from '../data/api';
import { createFinanceRepository, IFinanceRepository } from '../data/repositories';
import {
  createGetFinanceByCategoryUseCase,
  createGetFinanceByDateUseCase,
  IGetFinanceByCategoryUseCase,
  IGetFinanceByDateUseCase,
} from '../domain/usecases';

const financeDIContainer = new Container();

export const TYPES = {
  IFinanceAPI: Symbol('IFinanceAPI'),
  IFinanceRepository: Symbol('IFinanceRepository'),
  IGetFinanceByDateUseCase: Symbol('IGetFinanceByDateUseCase'),
  IGetFinanceByCategoryUseCase: Symbol('IGetFinanceByCategoryUseCase'),
};

// Create API instances
const financeAPI = createFinanceAPI();

// Create repository instances
const financeRepository = createFinanceRepository(financeAPI);

// Create use case instances
const getFinanceByDateUseCase = createGetFinanceByDateUseCase(financeRepository);
const getFinanceByCategoryUseCase = createGetFinanceByCategoryUseCase(financeRepository);
// Bind all instances
financeDIContainer.bind<IFinanceAPI>(TYPES.IFinanceAPI).toConstantValue(financeAPI);
financeDIContainer
  .bind<IFinanceRepository>(TYPES.IFinanceRepository)
  .toConstantValue(financeRepository);
financeDIContainer
  .bind<IGetFinanceByDateUseCase>(TYPES.IGetFinanceByDateUseCase)
  .toConstantValue(getFinanceByDateUseCase);
financeDIContainer
  .bind<IGetFinanceByCategoryUseCase>(TYPES.IGetFinanceByCategoryUseCase)
  .toConstantValue(getFinanceByCategoryUseCase);

export { financeDIContainer };
