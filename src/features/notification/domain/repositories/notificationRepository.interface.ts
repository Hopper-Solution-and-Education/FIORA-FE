import type { EmailNotificationLogs, Notification, UserNotification } from '@prisma/client';

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
}
