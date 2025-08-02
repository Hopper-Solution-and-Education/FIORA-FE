import { NotificationFilterOptions } from '../../data/dto/response/NotificationFilterOptionsResponse';
import { ChannelType, NotificationTo } from '../../domain';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';
import {
  NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  NotificationDashboardTableColumnKeyType,
} from '../../presentation/types/setting.type';

export interface NotificationDashboardFilterState {
  notifyType?: string[] | null;
  recipients?: string[] | null;
  sender?: string[] | null;
  notifyTo?: NotificationTo[] | null;
  channel?: ChannelType[] | null;
  status?: NotificationLogType[] | null;
  search?: string | null;
  sendDateFrom: Date | null;
  sendDateTo: Date | null;
}

export interface NotificationDashboardState {
  loading: boolean;
  error: string | null;
  columnConfig: NotificationDashboardTableColumnKeyType;
  filter: NotificationDashboardFilterState;
  filterOptions: NotificationFilterOptions | null;
  filterOptionsLoading: boolean;
}

export const initialState: NotificationDashboardState = {
  loading: false,
  error: null,
  columnConfig: NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  filter: {
    notifyTo: null,
    recipients: null,
    sender: null,
    notifyType: null,
    channel: null,
    status: null,
    search: null,
    sendDateFrom: null,
    sendDateTo: null,
  },
  filterOptions: null,
  filterOptionsLoading: false,
};
