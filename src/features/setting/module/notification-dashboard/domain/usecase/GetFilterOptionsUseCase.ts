import { decorate, inject, injectable } from 'inversify';
import { NotificationFilterOptions } from '../../data/dto/response/NotificationFilterOptionsResponse';
import { INotificationDashboardRepository } from '../../data/repository/INotificationDashboardRepository';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';

export interface IGetFilterOptionsUseCase {
  execute(): Promise<NotificationFilterOptions>;
}

export class GetFilterOptionsUseCase implements IGetFilterOptionsUseCase {
  private notificationDashboardRepository: INotificationDashboardRepository;

  constructor(notificationDashboardRepository: INotificationDashboardRepository) {
    this.notificationDashboardRepository = notificationDashboardRepository;
  }

  async execute(): Promise<NotificationFilterOptions> {
    return this.notificationDashboardRepository.getFilterOptions();
  }
}

decorate(injectable(), GetFilterOptionsUseCase);
decorate(
  inject(NOTIFICATION_DASHBOARD_TYPES.INotificationDashboardRepository),
  GetFilterOptionsUseCase,
  0,
);
