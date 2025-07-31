import { ChannelType, NotificationTo } from '../../domain';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';

// Filter options constants for easy customization
export const NOTIFICATION_DASHBOARD_FILTER_CONSTANTS = {
  STATUS_OPTIONS: [
    { value: NotificationLogType.SENT, label: 'SENT' },
    { value: NotificationLogType.FAILED, label: 'FAILED' },
  ],

  CHANNEL_OPTIONS: [
    { value: ChannelType.EMAIL, label: 'EMAIL' },
    { value: ChannelType.BOX, label: 'BOX' },
  ],

  NOTIFY_TO_OPTIONS: [
    { value: NotificationTo.ALL, label: 'ALL' },
    { value: NotificationTo.ROLE_ADMIN, label: 'ROLE_ADMIN' },
    { value: NotificationTo.ROLE_CS, label: 'ROLE_CS' },
    { value: NotificationTo.ROLE_USER, label: 'ROLE_USER' },
    { value: NotificationTo.PERSONAL, label: 'PERSONAL' },
  ],

  // Default date range for filtering (last 30 days)
  DEFAULT_DATE_RANGE: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(), // today
  },

  // Search placeholder text
  SEARCH_PLACEHOLDER: 'Search notifications by subject...',
};
