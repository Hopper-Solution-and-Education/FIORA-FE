import { PaginationResponse } from '@/shared/types';
import { Notification } from '../../../domain';

export type NotificationPaginatedResponse = PaginationResponse<Notification>;

export interface NotificationDashboardListPaginated {
  items: Notification[];
  page: number;
  pageSize: number;
  totalPage: number;
  total?: number;
}
