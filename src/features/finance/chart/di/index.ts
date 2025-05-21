import { Container } from 'inversify';
import { createFinanceRepository, IFinanceRepository } from '../data/repositories';
import { createGetFinanceByDateUseCase, IGetFinanceByDateUseCase } from '../domain/usecases';
import { createFinanceAPI, IFinanceAPI } from '../data/api';

const financeDIContainer = new Container();

export const TYPES = {
  IFinanceAPI: Symbol('IFinanceAPI'),
  IFinanceRepository: Symbol('IFinanceRepository'),
  IGetFinanceByDateUseCase: Symbol('IGetFinanceByDateUseCase'),
};

// Create API instances
const financeAPI = createFinanceAPI();

// Create repository instances
const financeRepository = createFinanceRepository(financeAPI);

// Create use case instances
const getFinanceByDateUseCase = createGetFinanceByDateUseCase(financeRepository);

// Bind all instances
financeDIContainer.bind<IFinanceAPI>(TYPES.IFinanceAPI).toConstantValue(financeAPI);
financeDIContainer
  .bind<IFinanceRepository>(TYPES.IFinanceRepository)
  .toConstantValue(financeRepository);
financeDIContainer
  .bind<IGetFinanceByDateUseCase>(TYPES.IGetFinanceByDateUseCase)
  .toConstantValue(getFinanceByDateUseCase);

export { financeDIContainer };
