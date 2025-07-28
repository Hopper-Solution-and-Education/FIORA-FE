export const NOTIFICATION_DASHBOARD_TYPES = {
  IHttpClient: Symbol.for('HttpClient'),
  INotificationDashboardApi: Symbol.for('NotificationDashboardApi'),
  INotificationDashboardRepository: Symbol.for('NotificationDashboardRepository'),
  IGetNotificationsPaginatedUseCase: Symbol.for('GetNotificationsPaginatedUseCase'),
  IGetFilterOptionsUseCase: Symbol.for('GetFilterOptionsUseCase'),
};
