import type { IHttpClient } from '@/config';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { routeConfig } from '@/shared/utils/route';
import { decorate, inject, injectable } from 'inversify';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';
import { NotificationDashboardFilterRequest } from '../dto/request/NotificationDashboardFilterRequest';
import { NotificationFilterOptionsResponse } from '../dto/response/NotificationFilterOptionsResponse';
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
    const params: Record<string, any> = {
      page,
      pageSize,
    };

    // Handle array parameters - send multiple params with same name for multiple values
    if (filter?.notifyTo && Array.isArray(filter.notifyTo)) {
      filter.notifyTo.forEach((value) => {
        if (!params.notifyTo) params.notifyTo = [];
        params.notifyTo.push(value);
      });
    } else if (filter?.notifyTo) {
      params.notifyTo = filter.notifyTo;
    }

    if (filter?.recipients && Array.isArray(filter.recipients)) {
      filter.recipients.forEach((value) => {
        if (!params.recipients) params.recipients = [];
        params.recipients.push(value);
      });
    } else if (filter?.recipients) {
      params.recipients = filter.recipients;
    }

    if (filter?.status && Array.isArray(filter.status)) {
      filter.status.forEach((value) => {
        if (!params.status) params.status = [];
        params.status.push(value);
      });
    } else if (filter?.status) {
      params.status = filter.status;
    }

    if (filter?.notifyType && Array.isArray(filter.notifyType)) {
      filter.notifyType.forEach((value) => {
        if (!params.type) params.type = [];
        params.type.push(value);
      });
    } else if (filter?.notifyType) {
      params.type = filter.notifyType;
    }

    if (filter?.channel && Array.isArray(filter.channel)) {
      filter.channel.forEach((value) => {
        if (!params.channel) params.channel = [];
        params.channel.push(value);
      });
    } else if (filter?.channel) {
      params.channel = filter.channel;
    }

    // Handle sender array
    if (filter?.sender && Array.isArray(filter.sender)) {
      filter.sender.forEach((value) => {
        if (!params.sender) params.sender = [];
        params.sender.push(value);
      });
    } else if (filter?.sender) {
      params.sender = filter.sender;
    }

    // Handle date range parameters - format as YYYY-MM-DD
    if (filter?.sendDateFrom) {
      params.sendDateFrom = filter.sendDateFrom.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    if (filter?.sendDateTo) {
      params.sendDateTo = filter.sendDateTo.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Map search to subject field for backend filtering
    if (filter?.search) {
      params.subject = filter.search;
    }

    // Convert params to URLSearchParams to handle multiple values with same name
    const searchParams = new URLSearchParams();

    // Add basic params
    searchParams.append('page', page.toString());
    searchParams.append('pageSize', pageSize.toString());

    // Add array params as multiple entries with same name
    if (params.notifyTo) {
      if (Array.isArray(params.notifyTo)) {
        params.notifyTo.forEach((value) => searchParams.append('notifyTo', value));
      } else {
        searchParams.append('notifyTo', params.notifyTo);
      }
    }

    if (params.recipients) {
      if (Array.isArray(params.recipients)) {
        params.recipients.forEach((value) => searchParams.append('recipients', value));
      } else {
        searchParams.append('recipients', params.recipients);
      }
    }

    if (params.status) {
      if (Array.isArray(params.status)) {
        params.status.forEach((value) => searchParams.append('status', value));
      } else {
        searchParams.append('status', params.status);
      }
    }

    if (params.type) {
      if (Array.isArray(params.type)) {
        params.type.forEach((value) => searchParams.append('type', value));
      } else {
        searchParams.append('type', params.type);
      }
    }

    if (params.channel) {
      if (Array.isArray(params.channel)) {
        params.channel.forEach((value) => searchParams.append('channel', value));
      } else {
        searchParams.append('channel', params.channel);
      }
    }

    if (params.sender) {
      if (Array.isArray(params.sender)) {
        params.sender.forEach((value) => searchParams.append('sender', value));
      } else {
        searchParams.append('sender', params.sender);
      }
    }

    // Add single value params
    if (params.sendDateFrom) {
      searchParams.append('sendDateFrom', params.sendDateFrom);
    }

    if (params.sendDateTo) {
      searchParams.append('sendDateTo', params.sendDateTo);
    }

    if (params.subject) {
      searchParams.append('search', params.subject);
    }

    // Build the URL with query parameters
    const baseUrl = routeConfig(ApiEndpointEnum.Notification);
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
