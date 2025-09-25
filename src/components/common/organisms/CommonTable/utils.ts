import { ColumnConfigMap, TableAlign } from './types';

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

export const getAlignClass = (align?: TableAlign) => {
  if (align === 'left') return 'text-left justify-start';
  if (align === 'right') return 'text-right justify-end';

  return 'text-center justify-center';
};
