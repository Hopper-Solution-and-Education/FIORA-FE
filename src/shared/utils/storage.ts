import { MODULE } from '../constants';

const MODULE_STORAGE_KEY = 'current_module';

export const getCurrentModule = (): string => {
  if (typeof window === 'undefined') return MODULE.HOME;
  return localStorage.getItem(MODULE_STORAGE_KEY) || MODULE.HOME;
};

export const setCurrentModule = (module: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODULE_STORAGE_KEY, module);
};
