import { httpClient } from '@/config';
import { Container } from 'inversify';
import { IReferralCronjobDashboardApi, ReferralCronjobDashboardApi } from '../data/api';
import { IReferralCronjobRepository, ReferralCronjobRepository } from '../data/repository';
import {
  GetReferralChartDataUseCase,
  GetReferralCronjobsPaginatedUseCase,
  GetReferralFilterOptionsUseCase,
  IGetReferralChartDataUseCase,
  IGetReferralCronjobsPaginatedUseCase,
  IGetReferralFilterOptionsUseCase,
} from '../domain';
import { REFERRAL_CRONJOB_TYPES } from './referralCronjobDashboardDI.type';

const referralCronjobContainer = new Container();

// Bind HttpClient
referralCronjobContainer.bind(REFERRAL_CRONJOB_TYPES.IHttpClient).toConstantValue(httpClient);

// Bind APIs
referralCronjobContainer
  .bind<IReferralCronjobDashboardApi>(REFERRAL_CRONJOB_TYPES.IReferralCronjobDashboardApi)
  .to(ReferralCronjobDashboardApi)
  .inSingletonScope();

// Bind Repositories
referralCronjobContainer
  .bind<IReferralCronjobRepository>(REFERRAL_CRONJOB_TYPES.IReferralCronjobRepository)
  .to(ReferralCronjobRepository)
  .inSingletonScope();

// Bind UseCases
referralCronjobContainer
  .bind<IGetReferralCronjobsPaginatedUseCase>(
    REFERRAL_CRONJOB_TYPES.IGetReferralCronjobsPaginatedUseCase,
  )
  .to(GetReferralCronjobsPaginatedUseCase)
  .inSingletonScope();

referralCronjobContainer
  .bind<IGetReferralChartDataUseCase>(REFERRAL_CRONJOB_TYPES.IGetReferralChartDataUseCase)
  .to(GetReferralChartDataUseCase)
  .inSingletonScope();

referralCronjobContainer
  .bind<IGetReferralFilterOptionsUseCase>(REFERRAL_CRONJOB_TYPES.IGetReferralFilterOptionsUseCase)
  .to(GetReferralFilterOptionsUseCase)
  .inSingletonScope();

export { referralCronjobContainer };
