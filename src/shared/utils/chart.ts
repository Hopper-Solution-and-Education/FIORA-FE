import { ColumnConfig, LineConfig } from '@/shared/types/chart.type';

export const findMaxMinValues = <T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig[],
  lines?: LineConfig[],
): { maxValue: number; minValue: number } => {
  let columnsMax = 0;
  let columnsMin = 0;

  // Find max/min for columns
  data.forEach((item) => {
    columns.forEach((column) => {
      const value = item[column.key] as number;
      if (value > 0 && value > columnsMax) columnsMax = value;
      if (value < 0 && value < columnsMin) columnsMin = value;
    });
  });

  // Find max/min for lines if provided
  let linesMax = 0;
  let linesMin = 0;

  if (lines && lines.length > 0) {
    data.forEach((item) => {
      lines.forEach((line) => {
        const value = item[line.key] as number;
        if (value > 0 && value > linesMax) linesMax = value;
        if (value < 0 && value < linesMin) linesMin = value;
      });
    });
  }

  // Get final max and min values
  const finalMax = Math.max(columnsMax, linesMax);
  const finalMin = Math.min(columnsMin, linesMin);

  return {
    maxValue: finalMax,
    minValue: finalMin,
  };
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
