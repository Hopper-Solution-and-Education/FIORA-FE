import { HttpResponse } from '@/shared/types';

export interface NotificationFilterOptions {
  sender: string[];
  recipient: string[];
  notifyType: string[];
}

export type NotificationFilterOptionsResponse = HttpResponse<NotificationFilterOptions>;
