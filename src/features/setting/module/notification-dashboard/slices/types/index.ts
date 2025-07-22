import { ChannelType, NotificationTo } from '../../domain';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';
import {
  NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  NotificationDashboardTableColumnKeyType,
} from '../../presentation/types/setting.type';

export interface NotificationDashboardFilterState {
  subject?: string | null;
  notifyType?: string | string[] | null; //deposit_request,...
  recipients?: string | string[] | null;
  sender?: string | null;
  notifyTo?: NotificationTo | null;
  channel?: ChannelType | null;
  status?: NotificationLogType | NotificationLogType[] | null;
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
    status: null,
    search: null,
  },
};
