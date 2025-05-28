import { Container } from 'inversify';
import { createFinanceAPI, createPartnerAPI, createProductAPI, IFinanceAPI } from '../data/api';
import { createAccountAPI } from '../data/api/accountApi';
import {
  createAccountRepository,
  createFinanceRepository,
  createPartnerRepository,
  createProductRepository,
  IFinanceRepository,
} from '../data/repositories';
import {
  createGetAllAccountsUseCase,
  createGetAllPartnersUseCase,
  createGetAllProductsUseCase,
  createGetFinanceByCategoryUseCase,
  createGetFinanceByDateUseCase,
  IGetAllAccountUseCase,
  IGetAllPartnerUseCase,
  IGetAllProductUseCase,
  IGetFinanceByCategoryUseCase,
  IGetFinanceByDateUseCase,
} from '../domain/usecases';

const financeDIContainer = new Container();

export const TYPES = {
  IFinanceAPI: Symbol('IFinanceAPI'),
  IFinanceRepository: Symbol('IFinanceRepository'),
  IGetFinanceByDateUseCase: Symbol('IGetFinanceByDateUseCase'),
  IGetFinanceByCategoryUseCase: Symbol('IGetFinanceByCategoryUseCase'),
  IGetAllAccountUseCase: Symbol('IGetAllAccountUseCase'),
  IGetAllProductUseCase: Symbol('IGetAllProductUseCase'),
  IGetAllPartnerUseCase: Symbol('IGetAllPartnerUseCase'),
};

// Create API instances
const financeAPI = createFinanceAPI();
const accountAPI = createAccountAPI();
const productAPI = createProductAPI();
const partnerAPI = createPartnerAPI();

// Create repository instances
const financeRepository = createFinanceRepository(financeAPI);
const accountRepository = createAccountRepository(accountAPI);
const productRepository = createProductRepository(productAPI);
const partnerRepository = createPartnerRepository(partnerAPI);

// Create use case instances
const getFinanceByDateUseCase = createGetFinanceByDateUseCase(financeRepository);
const getFinanceByCategoryUseCase = createGetFinanceByCategoryUseCase(financeRepository);
const getAllAccountUseCase = createGetAllAccountsUseCase(accountRepository);
const getAllProductUseCase = createGetAllProductsUseCase(productRepository);
const getAllPartnerUseCase = createGetAllPartnersUseCase(partnerRepository);

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
financeDIContainer
  .bind<IGetAllProductUseCase>(TYPES.IGetAllProductUseCase)
  .toConstantValue(getAllProductUseCase);
financeDIContainer
  .bind<IGetAllPartnerUseCase>(TYPES.IGetAllPartnerUseCase)
  .toConstantValue(getAllPartnerUseCase);

export { financeDIContainer };
