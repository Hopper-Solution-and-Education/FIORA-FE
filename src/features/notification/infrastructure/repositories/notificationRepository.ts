import { prisma } from '@/config';
import type { EmailNotificationLogs, UserNotification } from '@prisma/client';
import type { INotificationRepository } from '../../domain/repositories/notificationRepository.interface';

function getNotificationStatus(emailLogs: EmailNotificationLogs[]): 'FAILED' | 'SENT' | 'UNKNOWN' {
  if (!emailLogs || emailLogs.length === 0) return 'UNKNOWN';
  return emailLogs.some((log) => log.status === 'FAILED') ? 'FAILED' : 'SENT';
}

// Map filter key từ dashboard sang DB
function mapDashboardFilterToDB(filters: Record<string, any>) {
  const map: Record<string, string> = {
    subject: 'message',
    sender: 'createdBy',
    notifyType: 'type',
    recipients: 'emails',
  };
  const dbFilters: Record<string, any> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'recipients') {
      dbFilters['emails'] = Array.isArray(value) ? { hasSome: value } : { has: value };
    } else if (['channel', 'notifyType', 'type'].includes(key)) {
      dbFilters[key] = Array.isArray(value) ? { in: value } : value;
    } else if (map[key]) {
      dbFilters[map[key]] = value;
    } else if (['notifyTo', 'createdBy', 'message'].includes(key)) {
      dbFilters[key] = value;
    }
  }
  return dbFilters;
}

class NotificationRepository implements INotificationRepository {
  async getNotificationsPagination(
    skip: number,
    take?: number | null,
    filters: Record<string, any> = {},
  ): Promise<any[]> {
    const dbFilters = mapDashboardFilterToDB(filters);
    const query: any = {
      skip,
      orderBy: { createdAt: 'desc' },
      where: dbFilters,
      include: {
        userNotifications: true,
        emailLogs: true,
        emailTemplate: true,
        attachment: true,
      },
    };
    if (typeof take === 'number' && take > 0) {
      query.take = take;
    }
    const notifications = (await prisma.notification.findMany(query)) as any[];
    return notifications.map((n) => ({
      id: n.id,
      sendDate: n.createdAt,
      notifyTo: n.notifyTo,
      subject: n.message,
      recipients: n.emails,
      sender: n.createdBy,
      notifyType: n.type,
      channel: n.channel,
      status: getNotificationStatus(n.emailLogs),
      emailTemplate: n.emailTemplate
        ? { id: n.emailTemplate.id, name: n.emailTemplate.name }
        : null,
      attachment: n.attachment ? { id: n.attachment.id, url: n.attachment.url } : null,
    }));
  }

  async getNotificationById(id: string): Promise<any | null> {
    const n = await prisma.notification.findUnique({
      where: { id },
      include: {
        userNotifications: true,
        emailLogs: true,
        emailTemplate: true,
        attachment: true,
      },
    });
    if (!n) return null;
    return {
      id: n.id,
      sendDate: n.createdAt,
      notifyTo: n.notifyTo,
      subject: n.message,
      recipients: n.emails,
      sender: n.createdBy,
      notifyType: n.type,
      channel: n.channel,
      status: getNotificationStatus(n.emailLogs),
      emailTemplate: n.emailTemplate
        ? { id: n.emailTemplate.id, name: n.emailTemplate.name }
        : null,
      attachment: n.attachment ? { id: n.attachment.id, url: n.attachment.url } : null,
    };
  }

  async count(): Promise<number> {
    return prisma.notification.count();
  }

  async getUserNotification(userId: string): Promise<UserNotification[]> {
    return prisma.userNotification.findMany({ where: { userId } });
  }

  async getEmailNotificationLogs(notificationId: string): Promise<EmailNotificationLogs[]> {
    return prisma.emailNotificationLogs.findMany({ where: { notificationId } });
  }
}

export const notificationRepository = new NotificationRepository();
