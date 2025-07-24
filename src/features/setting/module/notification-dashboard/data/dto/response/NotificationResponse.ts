import { HttpResponse, PaginationResponse } from '@/shared/types';
import { Notification } from '../../../domain';

export type NotificationPaginatedResponse = HttpResponse<PaginationResponse<Notification>>;

export interface NotificationDashboardListPaginated {
  items: Notification[];
  page: number;
  pageSize: number;
  totalPage: number;
  total?: number;
}
