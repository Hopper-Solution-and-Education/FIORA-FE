import { prisma } from '@/config';
import {
  ChannelType,
  Notification,
  type EmailNotificationLogs,
  type UserNotification,
} from '@prisma/client';
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
    subject: n.title,
    recipients: n.emails,
    sender: n.createdBy ? userMap[n.createdBy]?.email || n.createdBy : 'System',
    notifyType: n.type,
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
    } else if (key === 'notifyTo') {
      dbFilters['notifyTo'] = Array.isArray(value) ? { in: value } : value;
    } else if (map[key]) {
      dbFilters[map[key]] = value;
    } else if (['createdBy', 'message'].includes(key)) {
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
  updateNotification(): Promise<Notification> {
    throw new Error('Method not implemented.');
  }

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

  async getNotificationsPaginationByUser(
    userId: string,
    skip: number,
    take?: number | null,
    filters: Record<string, any> = {},
  ): Promise<any[]> {
    const dbFilters = mapDashboardFilterToDB(filters);

    const query: any = {
      skip,
      orderBy: { createdAt: 'desc' },
      where: {
        ...dbFilters,
        userNotifications: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        userNotifications: {
          where: {
            userId: userId,
          },
        },
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
        userNotifications: {
          include: {
            User: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    let attachment = null;
    if (n?.attachmentId) {
      attachment = await prisma.attachment.findUnique({
        where: { id: n.attachmentId },
      });
    }
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
      attachment: attachment
        ? { id: attachment.id, url: attachment.url, type: attachment.type }
        : null,
      title: n.title,
      userNotifications: n.userNotifications,
      deepLink: n.deepLink,
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

  async getNotificationFilterOptions() {
    const notifications = await prisma.notification.findMany({
      select: {
        createdBy: true,
        emails: true,
        type: true,
      },
    });

    const senderIds = Array.from(new Set(notifications.map((n) => n.createdBy).filter(Boolean)));

    let senders: string[] = [];
    if (senderIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: senderIds as string[] } },
        select: { email: true },
      });
      senders = users.map((u) => u.email);
    }

    const recipientsSet = new Set<string>();
    notifications.forEach((n) => {
      if (Array.isArray(n.emails)) {
        n.emails.forEach((email: string) => recipientsSet.add(email));
      }
    });
    const recipients = Array.from(recipientsSet);

    const notifyTypes = Array.from(new Set(notifications.map((n) => n.type).filter(Boolean)));

    return {
      sender: senders,
      recipient: recipients,
      notifyType: notifyTypes,
    };
  }

  async createBoxNotification(input: CreateBoxNotificationInput): Promise<any> {
    const { title, type, attachmentId, deepLink, message, emails, notifyTo } = input;
    let users: { id: string; email: string }[] = [];

    if (notifyTo === 'ALL') {
      users = await prisma.user.findMany({
        where: { isDeleted: false },
        select: { id: true, email: true },
      });
    } else if (notifyTo === 'ROLE_ADMIN') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: 'Admin' },
        select: { id: true, email: true },
      });
    } else if (notifyTo === 'ROLE_CS') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: 'CS' },
        select: { id: true, email: true },
      });
    } else if (notifyTo === 'ROLE_USER') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: 'User' },
        select: { id: true, email: true },
      });
    } else if (notifyTo === 'PERSONAL') {
      if (!emails || emails.length === 0) {
        console.log('No email provided for PERSONAL notification');
        return;
        // throw new AppError(400, 'No email provided for PERSONAL notification');
      }
      users = await prisma.user.findMany({
        where: { isDeleted: false, email: { in: emails } },
        select: { id: true, email: true },
      });
    } else if (notifyTo === 'ADMIN_CS') {
      users = await prisma.user.findMany({
        where: { isDeleted: false, role: { in: ['Admin', 'CS'] } },
        select: { id: true, email: true },
      });
    }
    if (!users || users.length === 0) {
      console.log('No user found for this role or email');
      return;
      // throw new AppError(400, 'No user found for this role or email');
    }
    return await prisma.$transaction(async (tx) => {
      // 1. Tạo notification trước
      let notification = null;
      if (notifyTo === 'ROLE_CS' || notifyTo === 'ROLE_ADMIN' || notifyTo === 'ADMIN_CS') {
        const emailsHighRole = users.map((u) => u.email);
        console.log(
          '🚀 ~ NotificationRepository ~ createBoxNotification ~ emailsHighRole:',
          emailsHighRole,
        );
        emails?.push(...emailsHighRole);
      }
      notification = await tx.notification.create({
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
            Attachment: true,
          },
        },
      },
    });
  }

  // Lấy 20 UserNotification chưa đọc gần nhất theo userId, include notification và các bảng liên quan
  async getUserNotificationsUnread(
    userId: string,
    channel: ChannelType,
    take: number = 20,
  ): Promise<any[]> {
    return prisma.userNotification.findMany({
      where: { userId, isRead: false, AND: { notification: { channel: channel } } },
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        notification: {
          include: {
            emailLogs: true,
            emailTemplate: true,
            Attachment: true,
          },
        },
      },
    });
  }

  async markReadNotification(id: string): Promise<any> {
    return prisma.userNotification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async checkIfNotificationBelongToUser(id: string, userId: string): Promise<boolean> {
    const notification = await prisma.userNotification.findUnique({
      where: { id: id, userId: userId },
    });

    return !!notification;
  }
}

export const notificationRepository = new NotificationRepository();
