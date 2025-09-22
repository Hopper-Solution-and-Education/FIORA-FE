import { httpClient } from '@/config';
import { Container } from 'inversify';
import { ISavingInterestDashboardApi, SavingInterestDashboardApi } from '../data/api';
import { ISavingInterestRepository, SavingInterestRepository } from '../data/repository';
import {
  GetSavingInterestChartDataUseCase,
  GetSavingInterestPaginatedUseCase,
  IGetSavingInterestChartDataUseCase,
  IGetSavingInterestPaginatedUseCase,
} from '../domain/usecase';
import { SAVING_INTEREST_TYPES } from './savingInterestDashboardDI.type';

export const savingInterestContainer = new Container();

// Bind HttpClient
savingInterestContainer.bind(SAVING_INTEREST_TYPES.IHttpClient).toConstantValue(httpClient);

// Bind APIs
savingInterestContainer
  .bind<ISavingInterestDashboardApi>(SAVING_INTEREST_TYPES.ISavingInterestDashboardApi)
  .to(SavingInterestDashboardApi)
  .inSingletonScope();

// Bind Repositories
savingInterestContainer
  .bind<ISavingInterestRepository>(SAVING_INTEREST_TYPES.ISavingInterestRepository)
  .to(SavingInterestRepository)
  .inSingletonScope();

// Bind UseCases
savingInterestContainer
  .bind<IGetSavingInterestPaginatedUseCase>(
    SAVING_INTEREST_TYPES.IGetSavingInterestPaginatedUseCase,
  )
  .to(GetSavingInterestPaginatedUseCase)
  .inSingletonScope();

savingInterestContainer
  .bind<IGetSavingInterestChartDataUseCase>(
    SAVING_INTEREST_TYPES.IGetSavingInterestChartDataUseCase,
  )
  .to(GetSavingInterestChartDataUseCase)
  .inSingletonScope();
