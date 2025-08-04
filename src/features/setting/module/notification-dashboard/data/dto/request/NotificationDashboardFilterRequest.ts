import { ChannelType } from '../../../domain';

export interface NotificationDashboardFilterRequest {
  notifyTo?: string | string[];
  recipients?: string | string[];
  sender?: string | string[];
  notifyType?: string | string[];
  channel?: ChannelType | ChannelType[];
  status?: string | string[];
  search?: string;
  sendDateFrom?: Date;
  sendDateTo?: Date;
}
