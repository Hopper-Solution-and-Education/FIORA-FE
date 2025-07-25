export interface INotificationDetails {
  id: string;
  notifyTo: string;
  emails: string[];
  emailTemplateId?: string;
  attachmentId?: string;
  title: string;
  message?: string;
  notifyType: string;
  deepLink?: string;
  channel: ChannelType;
  createdAt: string;
  createdBy?: string;
  sendDate: string;
  updatedBy?: string;
  emailTemplate?: {
    id: string;
    name: string;
    content: string;
    isActive: boolean;
  };
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
  status: NotificationStatus;
  sender: string;
  recipients: string[];
  userNotifications: IUserNotification[];
  subject: string;
}

export enum NotificationStatus {
  SENT = 'SENT',
  FAILED = 'FAILED',
}
export enum ChannelType {
  BOX = 'BOX',
  EMAIL = 'EMAIL',
}

export interface IUserNotification {
  id: string;
  userId: string;
  notificationId: string;
  User: {
    email: string;
  };
  createdAt: string;
}
