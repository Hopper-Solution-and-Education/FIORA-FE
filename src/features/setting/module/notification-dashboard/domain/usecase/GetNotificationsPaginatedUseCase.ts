import { decorate, inject, injectable } from 'inversify';
import { NotificationDashboardFilterRequest } from '../../data/dto/request/NotificationDashboardFilterRequest';
import { NotificationDashboardListPaginated } from '../../data/dto/response/NotificationResponse';
import { INotificationDashboardRepository } from '../../data/repository/INotificationDashboardRepository';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';

export interface IGetNotificationsPaginatedUseCase {
  execute(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): Promise<NotificationDashboardListPaginated>;
}

export class GetNotificationsPaginatedUseCase implements IGetNotificationsPaginatedUseCase {
  private notificationDashboardRepository: INotificationDashboardRepository;

  constructor(notificationDashboardRepository: INotificationDashboardRepository) {
    this.notificationDashboardRepository = notificationDashboardRepository;
  }

  async execute(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): Promise<NotificationDashboardListPaginated> {
    return this.notificationDashboardRepository.getNotificationsPaginated(page, pageSize, filter);
  }
}

decorate(injectable(), GetNotificationsPaginatedUseCase);
decorate(
  inject(NOTIFICATION_DASHBOARD_TYPES.INotificationDashboardRepository),
  GetNotificationsPaginatedUseCase,
  0,
);
