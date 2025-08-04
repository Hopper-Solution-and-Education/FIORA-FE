import { ChannelType, NotificationTo } from '../../domain';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';

/**
 * Constants for notification dashboard filtering and UI behavior
 * Centralized configuration for easy customization and maintenance
 */
export const NOTIFICATION_DASHBOARD_FILTER_CONSTANTS = {
  // Status filter options for notification logs
  STATUS_OPTIONS: [
    { value: NotificationLogType.SENT, label: 'SENT' },
    { value: NotificationLogType.FAILED, label: 'FAILED' },
  ],

  // Channel type filter options
  CHANNEL_OPTIONS: [
    { value: ChannelType.EMAIL, label: 'EMAIL' },
    { value: ChannelType.BOX, label: 'BOX' },
  ],

  // Recipient type filter options
  NOTIFY_TO_OPTIONS: [
    { value: NotificationTo.ALL, label: 'ALL' },
    { value: NotificationTo.ROLE_ADMIN, label: 'ROLE_ADMIN' },
    { value: NotificationTo.ROLE_CS, label: 'ROLE_CS' },
    { value: NotificationTo.ROLE_USER, label: 'ROLE_USER' },
    { value: NotificationTo.PERSONAL, label: 'PERSONAL' },
  ],

  DEFAULT_DATE_RANGE: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(), // today
  },

  // Search input placeholder text
  SEARCH_PLACEHOLDER: 'Search subject...',

  SEARCH_DEBOUNCE_DELAY: 400,
};
