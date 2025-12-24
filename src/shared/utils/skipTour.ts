const LS_KEY = 'onborda_skip';

export const isSkipped = (featureKey: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(LS_KEY);
    const map: Record<string, boolean> = raw ? JSON.parse(raw) : {};

    return !!map[featureKey];
  } catch {
    return false;
  }
};

export const setSkip = (featureKey: string, skip = true): void => {
  if (typeof window === 'undefined') return;

  const raw = localStorage.getItem(LS_KEY);
  const map: Record<string, boolean> = raw ? JSON.parse(raw) : {};

  if (skip) map[featureKey] = true;
  else delete map[featureKey];

  localStorage.setItem(LS_KEY, JSON.stringify(map));
};

export const clearSkip = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(LS_KEY);
};
