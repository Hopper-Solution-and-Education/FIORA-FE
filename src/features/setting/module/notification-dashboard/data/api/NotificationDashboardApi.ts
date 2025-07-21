import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, injectable } from 'inversify';
import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationPaginatedResponse } from '../dto/response/NotificationResponse';
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
  ): Promise<NotificationPaginatedResponse> {
    const params = {
      page,
      pageSize,
      ...filter,
      notifyTo: Array.isArray(filter?.notifyTo) ? filter?.notifyTo.join(',') : filter?.notifyTo,
      recipients: Array.isArray(filter?.recipients)
        ? filter?.recipients.join(',')
        : filter?.recipients,
      status: Array.isArray(filter?.status) ? filter?.status.join(',') : filter?.status,
      notifyType: Array.isArray(filter?.notifyType)
        ? filter?.notifyType.join(',')
        : filter?.notifyType,
      channel: Array.isArray(filter?.channel) ? filter?.channel.join(',') : filter?.channel,
      subject: filter?.subject,
      sender: filter?.sender,
      search: filter?.search,
    };
    return this.httpClient.get(routeConfig(ApiEndpointEnum.Notification, {}, params));
  }
}

decorate(injectable(), NotificationDashboardApi);

export { NotificationDashboardApi };
