import { NotificationPaginatedResponse } from '../dto/response/NotificationResponse';

export class NotificationDashboardMapper {
  static toNotificationListPaginated(response: NotificationPaginatedResponse) {
    return {
      items: response.data.data,
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPage: response.data.totalPage,
      total: response.data.total,
    };
  }
}
