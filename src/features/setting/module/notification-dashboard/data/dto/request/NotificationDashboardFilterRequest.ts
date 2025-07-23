import { ChannelType, NotificationType } from '../../../domain';

export interface NotificationDashboardFilterRequest {
  subject?: string;
  notifyTo?: string | string[];
  recipients?: string | string[];
  sender?: string;
  notifyType?: NotificationType;
  channel?: ChannelType;
  status?: string | string[];
  search?: string;
}
