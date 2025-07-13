import { ChartFontSize } from '../types/chart.type';

export const DEFAULT_LOCALE = 'vi-VN';
export const DEFAULT_CURRENCY = 'VND';
export const DEFAULT_ICON = 'activity';
export const DEFAULT_BUDGET_ICON = 'calendar';
export const DEFAULT_MAX_BAR_RATIO = 1; // 90% of chart width for largest bar
export const CHART_MARGINS = { top: 10, right: 30, left: 100, bottom: 30 };
export const BASE_BAR_HEIGHT = 70; // Minimum height per bar in pixels
export const MIN_CHART_HEIGHT = 150; // Minimum height in pixels

export const DEFAULT_CHART_FONT_SIZE: ChartFontSize = {
  title: 18,
  axis: 14,
  tooltip: 14,
  legend: 14,
};

export const DEFAULT_CHART_TICK_COUNT: number = 8;

export const COLORS = {
  DEPS_DANGER: {
    LEVEL_1: '#ff0000',
    LEVEL_2: '#cc3333',
    LEVEL_3: '#ff6666',
    LEVEL_4: '#ff9999',
    LEVEL_5: '#ffcccc',
  },

  DEPS_SUCCESS: {
    LEVEL_1: '#008000',
    LEVEL_2: '#339933',
    LEVEL_3: '#66b366',
    LEVEL_4: '#99cc99',
    LEVEL_5: '#ccffcc',
  },

  DEPS_WARNING: {
    LEVEL_1: '#ffa500',
    LEVEL_2: '#ffb833',
    LEVEL_3: '#ffcc66',
    LEVEL_4: '#ffdd99',
    LEVEL_5: '#ffeecc',
  },

  DEPS_INFO: {
    LEVEL_1: '#1e90ff',
    LEVEL_2: '#4dabff',
    LEVEL_3: '#7ac5ff',
    LEVEL_4: '#a7dfff',
    LEVEL_5: '#d4eaff',
  },

  DEPS_DISABLE: {
    LEVEL_1: '#9ca3af', // Gray-400 - darkest for most disabled
    LEVEL_2: '#d1d5db', // Gray-300
    LEVEL_3: '#e5e7eb', // Gray-200
    LEVEL_4: '#f3f4f6', // Gray-100
    LEVEL_5: '#f9fafb', // Gray-50 - lightest for least disabled
  },
};

export enum STACK_TYPE {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  PROFIT = 'PROFIT',
}

export const STACK_KEY = {
  A: 'A',
  T: 'T',
  B: 'B',
};
