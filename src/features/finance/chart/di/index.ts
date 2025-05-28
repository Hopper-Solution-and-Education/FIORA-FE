import { Container } from 'inversify';
import { createFinanceAPI, IFinanceAPI } from '../data/api';
import { createAccountAPI } from '../data/api/accountApi';
import {
  createAccountRepository,
  createFinanceRepository,
  IFinanceRepository,
} from '../data/repositories';
import {
  createGetFinanceByCategoryUseCase,
  createGetFinanceByDateUseCase,
  IGetFinanceByCategoryUseCase,
  IGetFinanceByDateUseCase,
} from '../domain/usecases';
import {
  createGetAllAccountsUseCase,
  IGetAllAccountUseCase,
} from '../domain/usecases/getAllAccountsUseCase';

const financeDIContainer = new Container();

export const TYPES = {
  IFinanceAPI: Symbol('IFinanceAPI'),
  IFinanceRepository: Symbol('IFinanceRepository'),
  IGetFinanceByDateUseCase: Symbol('IGetFinanceByDateUseCase'),
  IGetFinanceByCategoryUseCase: Symbol('IGetFinanceByCategoryUseCase'),
  IGetAllAccountUseCase: Symbol('IGetAllAccountUseCase'),
};

// Create API instances
const financeAPI = createFinanceAPI();
const accountAPI = createAccountAPI();

// Create repository instances
const financeRepository = createFinanceRepository(financeAPI);
const accountRepository = createAccountRepository(accountAPI);

// Create use case instances
const getFinanceByDateUseCase = createGetFinanceByDateUseCase(financeRepository);
const getFinanceByCategoryUseCase = createGetFinanceByCategoryUseCase(financeRepository);
const getAllAccountUseCase = createGetAllAccountsUseCase(accountRepository);
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
financeDIContainer
  .bind<IGetAllAccountUseCase>(TYPES.IGetAllAccountUseCase)
  .toConstantValue(getAllAccountUseCase);

export { financeDIContainer };
