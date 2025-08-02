import { NotificationDashboardTableData } from '../types/setting.type';

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
