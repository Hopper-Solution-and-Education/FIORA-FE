import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { BadRequestError } from '@/shared/lib';
import type {
  CreateBoxNotificationInput,
  INotificationRepository,
} from '../../domain/repositories/notificationRepository.interface';

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
}

export default NotificationUseCase;
