import { httpClient } from '@/config';
import { Container } from 'inversify';
import { IMembershipCronjobDashboardApi, MembershipCronjobDashboardApi } from '../data/api';
import { IMembershipCronjobRepository, MembershipCronjobRepository } from '../data/repository';
import {
  GetMembershipCronjobsPaginatedUseCase,
  IGetMembershipCronjobsPaginatedUseCase,
} from '../domain/usecase/GetMembershipCronjobsPaginatedUseCase';
import {
  GetMembershipDynamicFieldsUseCase,
  IGetMembershipDynamicFieldsUseCase,
} from '../domain/usecase/GetMembershipDynamicFieldsUseCase';
import { MEMBERSHIP_CRONJOB_TYPES } from './membershipCronjobDashboardDI.type';

const membershipCronjobContainer = new Container();

// Bind HttpClient
membershipCronjobContainer.bind(MEMBERSHIP_CRONJOB_TYPES.IHttpClient).toConstantValue(httpClient);

// Bind APIs
membershipCronjobContainer
  .bind<IMembershipCronjobDashboardApi>(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobDashboardApi)
  .to(MembershipCronjobDashboardApi)
  .inSingletonScope();

// Bind Repositories
membershipCronjobContainer
  .bind<IMembershipCronjobRepository>(MEMBERSHIP_CRONJOB_TYPES.IMembershipCronjobRepository)
  .to(MembershipCronjobRepository)
  .inSingletonScope();

// Bind UseCases
membershipCronjobContainer
  .bind<IGetMembershipCronjobsPaginatedUseCase>(
    MEMBERSHIP_CRONJOB_TYPES.IGetMembershipCronjobsPaginatedUseCase,
  )
  .to(GetMembershipCronjobsPaginatedUseCase)
  .inSingletonScope();

membershipCronjobContainer
  .bind<IGetMembershipDynamicFieldsUseCase>(
    MEMBERSHIP_CRONJOB_TYPES.IGetMembershipDynamicFieldsUseCase,
  )
  .to(GetMembershipDynamicFieldsUseCase)
  .inSingletonScope();

export { membershipCronjobContainer };
