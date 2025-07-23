import { ChannelType } from '../../../domain';

export interface NotificationDashboardFilterRequest {
  subject?: string;
  notifyTo?: string | string[];
  recipients?: string | string[];
  sender?: string;
  notifyType?: string | string[];
  channel?: ChannelType;
  status?: string | string[];
  search?: string;
}
