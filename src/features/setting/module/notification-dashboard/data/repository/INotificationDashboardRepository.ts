import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationDashboardListPaginated } from '../dto/response/NotificationResponse';

export interface INotificationDashboardRepository {
  getNotificationsPaginated(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): Promise<NotificationDashboardListPaginated>;
}
