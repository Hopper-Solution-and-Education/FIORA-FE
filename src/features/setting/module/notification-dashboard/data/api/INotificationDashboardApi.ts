import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationPaginatedResponse } from '../dto/response/NotificationResponse';

export interface INotificationDashboardApi {
  getNotificationsPaginated(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): Promise<NotificationPaginatedResponse>;
}
