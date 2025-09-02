import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationFilterOptions } from '../dto/response/NotificationFilterOptionsResponse';
import { NotificationDashboardListPaginated } from '../dto/response/NotificationResponse';

export interface INotificationDashboardRepository {
  getNotificationsPaginated(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
    personal?: boolean,
  ): Promise<NotificationDashboardListPaginated>;

  getFilterOptions(): Promise<NotificationFilterOptions>;
}
