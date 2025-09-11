import { ColumnConfigMap } from './types';

export const loadColumnConfigFromStorage = (storageKey?: string): ColumnConfigMap | null => {
  try {
    if (!storageKey) return null;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw) as ColumnConfigMap;
  } catch {
    return null;
  }
};

export const saveColumnConfigToStorage = (
  storageKey: string | undefined,
  config: ColumnConfigMap,
) => {
  try {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify(config));
  } catch {
    // ignore
  }
};
