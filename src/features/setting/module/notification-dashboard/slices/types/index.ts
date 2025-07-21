import { ChannelType, NotificationType } from '../../domain';
import {
  NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  NotificationDashboardTableColumnKeyType,
} from '../../presentation/types/setting.type';

export interface NotificationDashboardFilterState {
  subject?: string | null;
  notifyTo?: string | string[] | null;
  recipients?: string | string[] | null;
  sender?: string | null;
  notifyType?: NotificationType | null;
  channel?: ChannelType | null;
  status?: string | string[] | null;
  search?: string | null;
}

export interface NotificationDashboardState {
  loading: boolean;
  error: string | null;
  columnConfig: NotificationDashboardTableColumnKeyType;
  filter: NotificationDashboardFilterState;
}

export const initialState: NotificationDashboardState = {
  loading: false,
  error: null,
  columnConfig: NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  filter: {
    subject: null,
    notifyTo: null,
    recipients: null,
    sender: null,
    notifyType: null,
    channel: null,
    status: 'all',
    search: null,
  },
};
