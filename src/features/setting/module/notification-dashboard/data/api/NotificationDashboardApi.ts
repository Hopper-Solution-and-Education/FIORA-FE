import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';
import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationFilterOptionsResponse } from '../dto/response/NotificationFilterOptionsResponse';
import { NotificationPaginatedResponse } from '../dto/response/NotificationResponse';
import { NotificationDashboardMapper } from '../mapper/NotificationMapper';
import { INotificationDashboardApi } from './INotificationDashboardApi';

class NotificationDashboardApi implements INotificationDashboardApi {
  private httpClient: IHttpClient;

  constructor(httpClient: IHttpClient) {
    this.httpClient = httpClient;
  }

  async getNotificationsPaginated(
    page: number,
    pageSize: number,
    filter?: NotificationDashboardFilterRequest,
    personal?: boolean,
  ): Promise<NotificationPaginatedResponse> {
    // Use mapper to convert filter to search parameters
    const searchParams = NotificationDashboardMapper.toSearchParams(page, pageSize, filter);

    // Build the URL with query parameters
    let baseUrl;
    if (personal) {
      baseUrl = routeConfig(ApiEndpointEnum.NotificationPersonal);
    } else {
      baseUrl = routeConfig(ApiEndpointEnum.Notification);
    }
    const url = `${baseUrl}?${searchParams.toString()}`;

    return this.httpClient.get(url);
  }

  async getFilterOptions(): Promise<NotificationFilterOptionsResponse> {
    const url = routeConfig(ApiEndpointEnum.NotificationFilterOptions);
    return this.httpClient.get(url);
  }
}

decorate(injectable(), NotificationDashboardApi);
decorate(inject(NOTIFICATION_DASHBOARD_TYPES.IHttpClient), NotificationDashboardApi, 0);

export { NotificationDashboardApi };
