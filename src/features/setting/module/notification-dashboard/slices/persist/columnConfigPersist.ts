// Logic persist columnConfig cho notification-dashboard
import { NotificationDashboardTableColumnKeyType } from '../../presentation/types/setting.type';

const STORAGE_KEY = 'notificationDashboardColumnConfig';

export function saveColumnConfigToStorage(config: NotificationDashboardTableColumnKeyType) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Could not save columnConfig to localStorage', e);
  }
}

export function loadColumnConfigFromStorage(): NotificationDashboardTableColumnKeyType | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load columnConfig from localStorage', e);
    return null;
  }
}
