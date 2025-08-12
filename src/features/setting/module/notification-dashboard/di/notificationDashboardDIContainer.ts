import { httpClient } from '@/config';
import { Container } from 'inversify';
import { INotificationDashboardApi, NotificationDashboardApi } from '../data/api';
import {
  INotificationDashboardRepository,
  NotificationDashboardRepository,
} from '../data/repository';
import {
  GetNotificationsPaginatedUseCase,
  IGetNotificationsPaginatedUseCase,
} from '../domain/usecase';
import {
  GetFilterOptionsUseCase,
  IGetFilterOptionsUseCase,
} from '../domain/usecase/GetFilterOptionsUseCase';
import { NOTIFICATION_DASHBOARD_TYPES } from './notificationDashboardDIContainer.type';

const notificationDashboardContainer = new Container();

// Bind HttpClient
notificationDashboardContainer
  .bind(NOTIFICATION_DASHBOARD_TYPES.IHttpClient)
  .toConstantValue(httpClient);

// Bind API
notificationDashboardContainer
  .bind<INotificationDashboardApi>(NOTIFICATION_DASHBOARD_TYPES.INotificationDashboardApi)
  .to(NotificationDashboardApi)
  .inSingletonScope();

// Bind Repository
notificationDashboardContainer
  .bind<INotificationDashboardRepository>(
    NOTIFICATION_DASHBOARD_TYPES.INotificationDashboardRepository,
  )
  .to(NotificationDashboardRepository)
  .inSingletonScope();

// Bind UseCase
notificationDashboardContainer
  .bind<IGetNotificationsPaginatedUseCase>(
    NOTIFICATION_DASHBOARD_TYPES.IGetNotificationsPaginatedUseCase,
  )
  .to(GetNotificationsPaginatedUseCase)
  .inSingletonScope();

// Bind Filter Options UseCase
notificationDashboardContainer
  .bind<IGetFilterOptionsUseCase>(NOTIFICATION_DASHBOARD_TYPES.IGetFilterOptionsUseCase)
  .to(GetFilterOptionsUseCase)
  .inSingletonScope();

export { notificationDashboardContainer };
