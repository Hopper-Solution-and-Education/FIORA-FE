import { NotificationPaginatedResponse } from '../dto/response/NotificationResponse';

export class NotificationDashboardMapper {
  static toNotificationListPaginated(response: NotificationPaginatedResponse) {
    return {
      items: response.data,
      page: response.page,
      pageSize: response.pageSize,
      totalPage: response.totalPage,
      total: response.total,
    };
  }
}
