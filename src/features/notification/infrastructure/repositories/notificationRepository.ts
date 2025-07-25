import { prisma } from '@/config';
import { AppError } from '@/shared/lib/responseUtils/errors';
import { ChannelType, type EmailNotificationLogs, type UserNotification } from '@prisma/client';
import type {
  CreateBoxNotificationInput,
  INotificationRepository,
} from '../../domain/repositories/notificationRepository.interface';

function getNotificationStatus(channel: string, emailLogs: any[]): 'SENT' | 'Failed' {
  if (channel === 'BOX') return 'SENT';
  if (channel === 'EMAIL') {
    if (emailLogs && emailLogs.some((log: any) => log.status === 'Failed')) {
      return 'Failed';
    }
    return 'SENT';
  }
  return 'SENT'; // fallback, should not happen
}

// Add a reusable mapping function for dashboard items
function mapNotificationDashboardItem(n: any, userMap: Record<string, any>): any {
  return {
    id: n.id,
    sendDate: n.createdAt,
    notifyTo: n.notifyTo,
    subject: n.message,
    recipients: n.emails,
    sender: n.createdBy ? userMap[n.createdBy]?.email || n.createdBy : 'System',
    notifyType: getNotificationStatus(n.channel, n.emailLogs),
    channel: n.channel,
    status: getNotificationStatus(n.channel, n.emailLogs),
    emailTemplate: n.emailTemplate,
    attachment: n.attachment,
    userNotifications: n.userNotifications,
    emailLogs: n.emailLogs,
  };
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

  if (filters.sendDateFrom && filters.sendDateTo) {
    dbFilters.createdAt = {};
    if (filters.sendDateFrom) {
      dbFilters.createdAt.gte = new Date(filters.sendDateFrom + 'T00:00:00.000Z');
    }
    if (filters.sendDateTo) {
      dbFilters.createdAt.lte = new Date(filters.sendDateTo + 'T23:59:59.999Z');
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
      },
    };
    if (typeof take === 'number' && take > 0) {
      query.take = take;
    }
    const notifications = (await prisma.notification.findMany(query)) as any[];

    const userIds = Array.from(new Set(notifications.map((n) => n.createdBy).filter(Boolean)));
    const users = userIds.length
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true },
        })
      : [];
    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));
    return notifications.map((n) => mapNotificationDashboardItem(n, userMap));
  }

  async getNotificationById(id: string): Promise<any | null> {
    const n = await prisma.notification.findUnique({
      where: { id },
      include: {
        userNotifications: true,
      },
    });
    if (!n) return null;
    let sender = 'System';
    if (n.createdBy) {
      const user = await prisma.user.findUnique({
        where: { id: n.createdBy },
        select: { email: true, name: true },
      });
      if (user) {
        sender = user.email;
      } else {
        sender = n.createdBy;
      }
    }
    return {
      id: n.id,
      sendDate: n.createdAt,
      notifyTo: n.notifyTo, // enum NotificationType
      subject: n.message,
      recipients: n.emails,
      sender,
      notifyType: n.type, // string
      channel: n.channel,
      status: n.channel === 'BOX' ? 'SENT' : 'UNKNOWN',
      emailTemplate: n.emailTemplateId ? { id: n.emailTemplateId } : null,
      attachment: n.attachmentId ? { id: n.attachmentId } : null,
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

  async createBoxNotification(input: CreateBoxNotificationInput): Promise<any> {
    const { title, type, attachmentId, deepLink, message, emails, notifyTo } = input;
    let users: { id: string }[] = [];

    if (notifyTo === 'ALL') {
      users = await prisma.user.findMany({ where: { isDeleted: false }, select: { id: true } });
    } else if (notifyTo === 'ROLE_ADMIN') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: 'Admin' },
        select: { id: true },
      });
    } else if (notifyTo === 'ROLE_CS') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: 'CS' },
        select: { id: true },
      });
    } else if (notifyTo === 'ROLE_USER') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: 'User' },
        select: { id: true },
      });
    } else if (notifyTo === 'PERSONAL') {
      if (!emails || emails.length === 0) {
        throw new AppError(400, 'No email provided for PERSONAL notification');
      }
      users = await prisma.user.findMany({
        where: { isDeleted: false, email: { in: emails } },
        select: { id: true },
      });
    }
    if (!users || users.length === 0) {
      throw new AppError(400, 'No user found for this role or email');
    }
    return await prisma.$transaction(async (tx) => {
      // 1. Tạo notification trước
      const notification = await tx.notification.create({
        data: {
          notifyTo: notifyTo,
          emails: emails || [],
          emailTemplateId: null,
          attachmentId: attachmentId || null,
          title,
          message,
          type: type,
          deepLink: deepLink || null,
          channel: ChannelType.BOX,
          createdAt: new Date(),
        },
      });
      // 2. Tạo userNotification với notificationId đã có
      await tx.userNotification.createMany({
        data: users.map((u) => ({ userId: u.id, notificationId: notification.id, isRead: false })),
        skipDuplicates: true,
      });
      return notification;
    });
  }

  // Lấy tất cả UserNotification của userId, include notification và các bảng liên quan
  async getUserNotifications(userId: string): Promise<any[]> {
    return prisma.userNotification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        notification: {
          include: {
            emailLogs: true,
            emailTemplate: true,
            attachment: true,
          },
        },
      },
    });
  }

  // Lấy 20 UserNotification chưa đọc gần nhất theo userId, include notification và các bảng liên quan
  async getUserNotificationsUnread(userId: string, take: number = 20): Promise<any[]> {
    return prisma.userNotification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        notification: {
          include: {
            emailLogs: true,
            emailTemplate: true,
            attachment: true,
          },
        },
      },
    });
  }
}

export const notificationRepository = new NotificationRepository();
