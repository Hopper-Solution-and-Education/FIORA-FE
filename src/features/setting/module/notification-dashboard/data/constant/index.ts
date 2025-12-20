import { ChannelType, NotificationTo } from '../../domain';
import { NotificationLogType } from '../../domain/enum/NotificationLogType';

/**
 * Constants for notification dashboard filtering and UI behavior
 * Centralized configuration for easy customization and maintenance
 */
export const NOTIFICATION_DASHBOARD_FILTER_CONSTANTS = {
  // Status filter options for notification logs
  STATUS_OPTIONS: [
    { value: NotificationLogType.SENT, label: 'Sent' },
    { value: NotificationLogType.FAILED, label: 'Failed' },
  ],

  // Channel type filter options
  CHANNEL_OPTIONS: [
    { value: ChannelType.EMAIL, label: 'Email' },
    { value: ChannelType.BOX, label: 'Box' },
  ],

  // Recipient type filter options
  NOTIFY_TO_OPTIONS: [
    { value: NotificationTo.ALL, label: 'All' },
    { value: NotificationTo.ADMIN_CS, label: 'Admin and CS' },
    { value: NotificationTo.ROLE_ADMIN, label: 'Admin' },
    { value: NotificationTo.ROLE_CS, label: 'CS' },
    { value: NotificationTo.ROLE_USER, label: 'User' },
    { value: NotificationTo.PERSONAL, label: 'Personal' },
  ],

  DEFAULT_DATE_RANGE: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(), // today
  },

  // Search input placeholder text
  SEARCH_PLACEHOLDER: 'Search subject...',

  SEARCH_DEBOUNCE_DELAY: 400,
};
