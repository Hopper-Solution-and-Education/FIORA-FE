import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationFilterOptionsResponse } from '../dto/response/NotificationFilterOptionsResponse';
import { NotificationPaginatedResponse } from '../dto/response/NotificationResponse';

export interface INotificationDashboardApi {
  getNotificationsPaginated(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): Promise<NotificationPaginatedResponse>;

  getFilterOptions(): Promise<NotificationFilterOptionsResponse>;
}
