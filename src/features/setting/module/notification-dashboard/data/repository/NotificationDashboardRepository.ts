import { decorate, inject, injectable } from 'inversify';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';
import { INotificationDashboardApi } from '../api/INotificationDashboardApi';
import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationDashboardListPaginated } from '../dto/response/NotificationResponse';
import { NotificationDashboardMapper } from '../mapper';
import { INotificationDashboardRepository } from './INotificationDashboardRepository';

export class NotificationDashboardRepository implements INotificationDashboardRepository {
  private notificationDashboardApi: INotificationDashboardApi;

  constructor(notificationDashboardApi: INotificationDashboardApi) {
    this.notificationDashboardApi = notificationDashboardApi;
  }

  async getNotificationsPaginated(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): Promise<NotificationDashboardListPaginated> {
    const response = await this.notificationDashboardApi.getNotificationsPaginated(
      page,
      pageSize,
      filter,
    );
    return NotificationDashboardMapper.toNotificationListPaginated(response);
  }
}

decorate(injectable(), NotificationDashboardRepository);
decorate(
  inject(NOTIFICATION_DASHBOARD_TYPES.INotificationDashboardApi),
  NotificationDashboardRepository,
  0,
);

export const createNotificationDashboardRepository = (
  notificationDashboardApi: INotificationDashboardApi,
): INotificationDashboardRepository => {
  return new NotificationDashboardRepository(notificationDashboardApi);
};
