import { prisma, sendBulkEmailUtility, sendEmailCronJob } from '@/config';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { BadRequestError } from '@/shared/lib';
import { ChannelType, NotificationType } from '@prisma/client';
import type {
  CreateBoxNotificationInput,
  INotificationRepository,
} from '../../domain/repositories/notificationRepository.interface';
import { notificationRepository } from '../../infrastructure/repositories/notificationRepository';

const DASHBOARD_FIELDS = [
  'subject',
  'notifyTo',
  'recipients',
  'sender',
  'notifyType',
  'channel',
  'status',
];

// Khai báo kiểu dữ liệu dashboard notification
export interface NotificationDashboardItem {
  id: string;
  sendDate: Date;
  notifyTo: string;
  subject: string;
  recipients: string[];
  sender: string | null;
  notifyType: string;
  channel: string;
  status: string;
  emailTemplate?: any;
  attachment?: any;
  [key: string]: any;
}

// Types cho hàm sendNotificationWithTemplate
export interface EmailPart {
  user_id: string;
  recipient: string;
  [key: string]: any; // Các variables khác
}

export interface SendNotificationResult {
  notificationId: string;
  totalProcessed: number;
  successCount: number;
  failedCount: number;
  details: Array<{
    emails: string[];
    success: boolean;
    error?: string;
  }>;
}

// Utility function để render template với variables
const renderEmailTemplate = (templateContent: string, variables: Record<string, any>): string => {
  let result = templateContent;

  // Replace variables in format {{variable_name}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, String(value));
  });

  return result;
};

class NotificationUseCase {
  constructor(private notificationRepository: INotificationRepository) {}

  async getNotificationsPagination({
    page = 1,
    pageSize = 20,
    filters = {},
    search = '',
  }: {
    page?: number;
    pageSize?: number;
    filters?: any;
    search?: string;
  }): Promise<{
    data: NotificationDashboardItem[];
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
  }> {
    let notifications = (await this.notificationRepository.getNotificationsPagination(
      0,
      10000,
      filters,
    )) as unknown as NotificationDashboardItem[];

    if (filters && filters.status) {
      const statusArr = Array.isArray(filters.status) ? filters.status : [filters.status];
      notifications = notifications.filter((n) => statusArr.includes(n.status));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      notifications = notifications.filter((n) =>
        DASHBOARD_FIELDS.filter((field) => n[field] !== undefined && n[field] !== null).some(
          (field) => String(n[field]).toLowerCase().includes(searchLower),
        ),
      );
    }

    const total = notifications.length;
    const totalPage = Math.ceil(total / pageSize);
    const data = notifications.slice((page - 1) * pageSize, page * pageSize);

    return {
      data,
      total,
      totalPage,
      page,
      pageSize,
    };
  }

  async getNotificationsPaginationByUser({
    page = 1,
    pageSize = 20,
    filters = {},
    search = '',
    userId,
  }: {
    page?: number;
    pageSize?: number;
    filters?: any;
    search?: string;
    userId: string;
  }): Promise<{
    data: NotificationDashboardItem[];
    total: number;
    totalPage: number;
    page: number;
    pageSize: number;
  }> {
    let notifications = (await this.notificationRepository.getNotificationsPaginationByUser(
      userId,
      0,
      10000,
      filters,
    )) as unknown as NotificationDashboardItem[];

    if (filters && filters.status) {
      const statusArr = Array.isArray(filters.status) ? filters.status : [filters.status];
      notifications = notifications.filter((n) => statusArr.includes(n.status));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      notifications = notifications.filter((n) =>
        DASHBOARD_FIELDS.filter((field) => n[field] !== undefined && n[field] !== null).some(
          (field) => String(n[field]).toLowerCase().includes(searchLower),
        ),
      );
    }

    const total = notifications.length;
    const totalPage = Math.ceil(total / pageSize);
    const data = notifications.slice((page - 1) * pageSize, page * pageSize);

    return {
      data,
      total,
      totalPage,
      page,
      pageSize,
    };
  }

  async createBoxNotification(input: CreateBoxNotificationInput) {
    return this.notificationRepository.createBoxNotification(input);
  }

  async getNotificationById(id: string) {
    return this.notificationRepository.getNotificationById(id);
  }

  async getNotificationFilterOptions() {
    return this.notificationRepository.getNotificationFilterOptions();
  }

  async markReadNotification(id: string, userId: string) {
    const isBelongToUser = await this.notificationRepository.checkIfNotificationBelongToUser(
      id,
      userId,
    );

    if (!isBelongToUser) {
      throw new BadRequestError(Messages.NOTIFICATION_NOT_BELONG_TO_USER, {
        statusCode: RESPONSE_CODE.BAD_REQUEST,
      });
    }
    return this.notificationRepository.markReadNotification(id);
  }

  async sendNotificationWithTemplate(
    emailTemplateId: string,
    emailParts: EmailPart[],
    notifyTo: NotificationType,
    type: string,
    subject?: string,
  ): Promise<SendNotificationResult> {
    try {
      // 1. Validate và lấy email template
      const emailTemplate = await prisma.emailTemplate.findUnique({
        where: { id: emailTemplateId },
      });

      if (!emailTemplate) {
        throw new BadRequestError(`Email template with ID ${emailTemplateId} not found`);
      }

      if (!emailTemplate.isActive) {
        throw new BadRequestError(`Email template ${emailTemplate.name} is not active`);
      }

      // 2. Validate emailParts
      if (!emailParts || emailParts.length === 0) {
        throw new BadRequestError('Email parts cannot be empty');
      }

      // 3. Tạo Notification record
      const notification = await prisma.notification.create({
        data: {
          title: subject || `Hopper - ${emailTemplate.name}`,
          message: emailTemplate.content,
          channel: ChannelType.EMAIL,
          notifyTo: notifyTo,
          type: type,
          emails: emailParts.map((part) => part.recipient),
          emailTemplateId: emailTemplateId,
          createdBy: null,
        },
      });

      const result: SendNotificationResult = {
        notificationId: notification.id,
        totalProcessed: 0,
        successCount: 0,
        failedCount: 0,
        details: [],
      };

      // 4. Process từng emailPart
      for (const emailPart of emailParts) {
        try {
          // Validate emailPart
          if (!emailPart.recipient || !emailPart.user_id) {
            console.error('Invalid emailPart:', emailPart);
            result.failedCount++;
            result.details.push({
              emails: [emailPart.recipient || 'unknown'],
              success: false,
              error: 'Missing recipient or user_id',
            });
            continue;
          }

          // Render template với variables từ emailPart
          const renderedContent = renderEmailTemplate(emailTemplate.content, emailPart);

          // Gửi email
          const emailResult = await sendBulkEmailUtility(
            [emailPart.recipient],
            subject || `Hopper - ${emailTemplate.name}`,
            renderedContent,
          );

          // Tạo UserNotification record
          await prisma.userNotification.create({
            data: {
              userId: emailPart.user_id,
              notificationId: notification.id,
              isRead: false,
              createdBy: null,
            },
          });

          // Log kết quả
          await prisma.emailNotificationLogs.create({
            data: {
              notificationId: notification.id,
              userId: emailPart.user_id,
              status: emailResult.success ? 'SENT' : 'FAILED',
              errorMessage: emailResult.success ? null : 'Email sending failed',
              createdBy: null,
            },
          });

          // Update result
          result.totalProcessed++;
          if (emailResult.success) {
            result.successCount++;
            result.details.push({
              emails: [emailPart.recipient],
              success: true,
            });
          } else {
            result.failedCount++;
            result.details.push({
              emails: [emailPart.recipient],
              success: false,
              error: 'Email sending failed',
            });
          }
        } catch (error) {
          console.error('Error processing emailPart:', emailPart, error);

          // Log error
          await prisma.emailNotificationLogs.create({
            data: {
              notificationId: notification.id,
              userId: emailPart.user_id || 'unknown',
              status: 'FAILED',
              errorMessage: error instanceof Error ? error.message : 'Unknown error',
              createdBy: null,
            },
          });

          result.failedCount++;
          result.details.push({
            emails: [emailPart.recipient || 'unknown'],
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      console.log(
        `Notification sent: ${result.successCount} success, ${result.failedCount} failed`,
      );
      return result;
    } catch (error) {
      await prisma.emailNotificationLogs.create({
        data: {
          notificationId: emailTemplateId,
          userId: 'unknown',
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          createdBy: null,
        },
      });
      console.error('sendNotificationWithTemplate failed:', error);
      throw new BadRequestError(
        `Failed to send notification: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async createNotificationCronjob(
    input: CreateBoxNotificationInput,
    to: string,
    username: string,
    tier_name: string,
    updated_at: string,
    user_id: string,
  ) {
    const notification = await this.notificationRepository.createBoxNotification(input);
    const emailResult = await sendEmailCronJob(to, username, tier_name, updated_at);

    await prisma.emailNotificationLogs.create({
      data: {
        notificationId: notification.id,
        userId: user_id,
        status: emailResult ? 'SENT' : 'FAILED',
        errorMessage: emailResult ? null : 'Email sending failed',
        createdBy: null,
      },
    });
    return notification;
  }
}

export const notificationUseCase = new NotificationUseCase(notificationRepository);
