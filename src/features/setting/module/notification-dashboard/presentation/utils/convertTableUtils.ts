import {
  NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG,
  NotificationDashboardTableData,
} from '../types/setting.type';

/**
 * Clean filter object by removing null/undefined values
 * This prevents sending unnecessary parameters to the API
 */
export function cleanFilter(filter: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in filter) {
    if (filter[key] !== null) result[key] = filter[key];
  }
  return result;
}

/**
 * Convert API response data to table data format
 * Maps notification entity to table row data structure
 */
export function convertToTableData(item: any): NotificationDashboardTableData {
  return {
    id: item.id,
    sendDate: item.sendDate,
    notifyTo: item.notifyTo,
    subject: item.subject,
    recipients: item.recipients,
    sender: item.sender,
    notifyType: item.notifyType,
    channel: item.channel,
    status: item.status,
    key: item.id,
  };
}

/**
 * Get alignment class based on column configuration
 * Shared utility function for consistent alignment across components
 */
export function getAlignClass(col: string): string {
  const side =
    NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG[
      col as keyof typeof NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG
    ]?.side || 'center';

  switch (side) {
    case 'left':
      return 'text-left';
    case 'right':
      return 'text-right';
    default:
      return 'text-center';
  }
}

/**
 * Get alignment class for skeleton rows (includes justify classes)
 * Used specifically for skeleton loading states
 */
export function getSkeletonAlignClass(col: string): { cellClass: string; flexClass: string } {
  const side =
    NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG[
      col as keyof typeof NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG
    ]?.side || 'center';

  switch (side) {
    case 'left':
      return { cellClass: 'text-left', flexClass: 'justify-start' };
    case 'right':
      return { cellClass: 'text-right', flexClass: 'justify-end' };
    default:
      return { cellClass: 'text-center', flexClass: 'justify-center' };
  }
}
