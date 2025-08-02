// Logic persist columnConfig cho wallet-setting
import { WalletSettingTableColumnKeyType } from '../../presentation/types/setting.type';

const STORAGE_KEY = 'walletSettingColumnConfig';

export function saveColumnConfigToStorage(config: WalletSettingTableColumnKeyType) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Could not save columnConfig to localStorage', e);
  }
}

export function loadColumnConfigFromStorage(): WalletSettingTableColumnKeyType | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load columnConfig from localStorage', e);
    return null;
  }
}
