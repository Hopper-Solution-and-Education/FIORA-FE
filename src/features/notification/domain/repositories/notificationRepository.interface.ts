import { NotificationFilterOptions } from '@/shared/types';
import type {
  EmailNotificationLogs,
  Notification,
  NotificationType,
  UserNotification,
} from '@prisma/client';

export interface CreateBoxNotificationInput {
  title: string;
  type: string;
  notifyTo: NotificationType;
  attachmentId?: string;
  deepLink?: string;
  message: string;
  emails?: string[];
}

export interface CreateNotificationWithTemplateInput {
  title: string;
  type: string;
  notifyTo: NotificationType;
  attachmentId?: string;
  deepLink?: string;
  message: string;
  emails?: string[];
  emailTemplateId: string;
  emailParts: Array<{
    user_id: string;
    recipient: string;
    [key: string]: any;
  }>;
  subject?: string;
}

export interface INotificationRepository {
  getNotificationsPagination(
    skip: number,
    take: number,
    filters?: Record<string, any>,
  ): Promise<Notification[]>;
  getNotificationById(id: string): Promise<Notification | null>;
  count(): Promise<number>;
  getUserNotification(userId: string): Promise<UserNotification[]>;
  getEmailNotificationLogs(notificationId: string): Promise<EmailNotificationLogs[]>;
  createBoxNotification(input: CreateBoxNotificationInput): Promise<Notification>;
  getNotificationFilterOptions(): Promise<NotificationFilterOptions>;
  markReadNotification(id: string): Promise<any>;
  checkIfNotificationBelongToUser(id: string, userId: string): Promise<boolean>;
  getNotificationsPaginationByUser(
    userId: string,
    skip: number,
    take: number,
    filters?: Record<string, any>,
  ): Promise<Notification[]>;
}
