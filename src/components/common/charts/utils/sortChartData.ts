import { ColumnConfig } from '@/shared/types/chart.type';

/**
 * Sort chart data by value in descending order (highest first)
 * Used for simple bar charts with value property
 */
export const sortByValue = <T extends { value: number }>(data: T[]): T[] => {
  return [...data].sort((a, b) => b.value - a.value);
};

/**
 * Sort chart data by absolute value in descending order (highest first)
 * Used for charts with positive/negative values
 */
export const sortByAbsoluteValue = <T extends { value: number }>(data: T[]): T[] => {
  return [...data].sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
};

/**
 * Sort chart data by a specific property value in descending order (highest first)
 * Used for stacked bar charts or charts with multiple value properties
 */
export const sortByProperty = <T extends Record<string, any>>(
  data: T[],
  propertyKey: string,
): T[] => {
  return [...data].sort((a, b) => {
    const aValue = typeof a[propertyKey] === 'number' ? a[propertyKey] : 0;
    const bValue = typeof b[propertyKey] === 'number' ? b[propertyKey] : 0;
    return (bValue as number) - (aValue as number);
  });
};

/**
 * Sort chart data by the sum of all column values in descending order (highest first)
 * Used for composed charts with multiple columns
 */
export const sortByAllColumns = <T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig[],
): T[] => {
  if (!columns.length) return data;
  return [...data].sort((a, b) => {
    const aSum = columns.reduce((sum, col) => {
      const value = typeof a[col.key] === 'number' ? Math.abs(a[col.key]) : 0;
      return sum + (value as number);
    }, 0);
    const bSum = columns.reduce((sum, col) => {
      const value = typeof b[col.key] === 'number' ? Math.abs(b[col.key]) : 0;
      return sum + (value as number);
    }, 0);
    return bSum - aSum;
  });
};

/**
 * Sort chart data by the first column's absolute value in descending order (highest first)
 * Used for vertical positive/negative bar charts
 */
export const sortByFirstColumnAbsolute = <T extends Record<string, any>>(
  data: T[],
  columns: ColumnConfig[],
): T[] => {
  if (!columns.length) return data;
  const firstColumnKey = columns[0].key;
  return [...data].sort((a, b) => {
    const aValue = typeof a[firstColumnKey] === 'number' ? Math.abs(a[firstColumnKey]) : 0;
    const bValue = typeof b[firstColumnKey] === 'number' ? Math.abs(b[firstColumnKey]) : 0;
    return (bValue as number) - (aValue as number);
  });
};

/**
 * Generic sort function with sortEnable flag
 * Returns original data if sortEnable is false, otherwise applies the sort function
 */
export const sortChartData = <T>(
  data: T[],
  sortEnable: boolean,
  sortFn: (data: T[]) => T[],
): T[] => {
  if (!sortEnable) return data;
  return sortFn(data);
};
