import { ColumnConfig } from '@/shared/types/chart.type';

export const findMaxMinValues = <T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig[],
): { maxValue: number; minValue: number } => {
  let max = 0;
  let min = 0;

  data.forEach((item) => {
    columns.forEach((column) => {
      const value = item[column.key] as number;
      if (value > 0 && value > max) max = value;
      if (value < 0 && value < min) min = value;
    });
  });

  return { maxValue: max, minValue: min };
};

export const buildResponsiveBarCategoryGap = <T extends Record<string, any>>(
  data: T[],
  options?: {
    minGap?: number | string;
    maxGap?: number | string;
    defaultGap?: number | string;
    thresholds?: Record<number, number | string>;
  },
): string | number => {
  const {
    defaultGap = '20%',
    thresholds = {
      2: '40%',
      5: '30%',
      10: '20%',
      15: '10%',
      Infinity: '0%',
    },
  } = options || {};

  if (!data || data.length === 0) {
    return defaultGap;
  }

  const dataLength = data.length;

  const thresholdKeys = Object.keys(thresholds)
    .map(Number)
    .sort((a, b) => a - b);

  for (const threshold of thresholdKeys) {
    if (dataLength <= threshold) {
      return thresholds[threshold];
    }
  }

  return defaultGap;
};
