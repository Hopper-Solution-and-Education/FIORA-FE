import { httpClient } from '@/config';
import { Container } from 'inversify';
import { IReferralCronjobDashboardApi, ReferralCronjobDashboardApi } from '../data/api';
import { IReferralCronjobRepository, ReferralCronjobRepository } from '../data/repository';
import { REFERRAL_CRONJOB_TYPES } from './referralCronjobDashboardDI.type';
import {
  GetReferralChartDataUseCase,
  GetReferralCronjobsPaginatedUseCase,
  IGetReferralChartDataUseCase,
  IGetReferralCronjobsPaginatedUseCase,
} from '../domain';

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

export { referralCronjobContainer };
