import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
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

  /**
   * Converts filter request to URL search parameters
   * Handles array parameters by creating multiple entries with the same name
   */
  static toSearchParams(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
  ): URLSearchParams {
    const searchParams = new URLSearchParams();

    // Add basic pagination params
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());

    if (!filter) {
      return searchParams;
    }

    // Handle array parameters - send multiple params with same name for multiple values
    this.appendArrayParam(searchParams, 'notifyTo', filter.notifyTo);
    this.appendArrayParam(searchParams, 'recipients', filter.recipients);
    this.appendArrayParam(searchParams, 'status', filter.status);
    this.appendArrayParam(searchParams, 'type', filter.notifyType);
    this.appendArrayParam(searchParams, 'channel', filter.channel);
    this.appendArrayParam(searchParams, 'sender', filter.sender);

    // Handle date range parameters - format as YYYY-MM-DD
    if (filter.sendDateFrom) {
      searchParams.append('sendDateFrom', filter.sendDateFrom.toISOString().split('T')[0]);
    }

    if (filter.sendDateTo) {
      searchParams.append('sendDateTo', filter.sendDateTo.toISOString().split('T')[0]);
    }

    // Map search to subject field for backend filtering
    if (filter.search) {
      searchParams.append('search', filter.search);
    }

    return searchParams;
  }

  /**
   * Helper method to append array parameters to URLSearchParams
   * Handles both single values and arrays
   */
  private static appendArrayParam(
    searchParams: URLSearchParams,
    paramName: string,
    value?: string | string[] | any,
  ) {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(paramName, item));
    } else {
      searchParams.append(paramName, value);
    }
  }
}
