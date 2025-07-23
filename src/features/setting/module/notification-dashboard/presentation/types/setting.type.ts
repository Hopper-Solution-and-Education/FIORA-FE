export interface NotificationDashboardTableData {
  id: string;
  sendDate: string;
  notifyTo: string;
  subject: string;
  recipients: string | string[];
  sender: string;
  notifyType: string;
  channel: string;
  status: string;
  key: string;
}

export type NotificationDashboardTableColumn = {
  index: number;
  sortable: boolean;
  sortedBy?: 'asc' | 'desc';
  isVisible: boolean;
};

export type NotificationDashboardTableColumnKey =
  | 'No.'
  | 'Send Date'
  | 'Notify To'
  | 'Subject'
  | 'Recipients'
  | 'Sender'
  | 'Notify Type'
  | 'Channel'
  | 'Status'
  | 'Action';

export type NotificationDashboardTableColumnKeyType = {
  [key in NotificationDashboardTableColumnKey]: NotificationDashboardTableColumn;
};

export const NOTIFICATION_DASHBOARD_TABLE_COLUMN_CONFIG: NotificationDashboardTableColumnKeyType = {
  'No.': { index: 0, sortable: false, isVisible: true },
  'Send Date': { index: 1, sortable: true, isVisible: true },
  'Notify To': { index: 2, sortable: true, isVisible: true },
  Subject: { index: 3, sortable: true, isVisible: true },
  Recipients: { index: 4, sortable: false, isVisible: true },
  Sender: { index: 5, sortable: true, isVisible: true },
  'Notify Type': { index: 6, sortable: true, isVisible: true },
  Channel: { index: 7, sortable: true, isVisible: true },
  Status: { index: 8, sortable: true, isVisible: true },
  Action: { index: 9, sortable: false, isVisible: true },
};
