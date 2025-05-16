import {
  BarItem,
  PositiveAndNegativeBarLevelConfig,
  PositiveAndNegativeBarChartProps,
  ChartConfig,
} from './type';
import { getChartMargins } from '@/shared/utils/device';
import { BASE_BAR_HEIGHT, MIN_CHART_HEIGHT } from '@/shared/constants/chart';

// Process initial data and calculate total item
const processInitialData = (
  data: BarItem[],
  levelConfig?: PositiveAndNegativeBarLevelConfig,
): BarItem[] => {
  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);
  const totalName = levelConfig?.totalName || 'Net Total';
  const totalItem: BarItem = {
    name: totalName,
    value: totalAmount,
    color: totalAmount >= 0 ? levelConfig?.colorPositive[0] : levelConfig?.colorNegative[0],
    type: data[0]?.type || 'unknown',
    children: data,
    depth: 0,
  };
  return [totalItem];
};

// Build processed data with hierarchical structure
const buildProcessedData = (
  items: BarItem[],
  expandedItems: Record<string, boolean>,
  levelConfig?: PositiveAndNegativeBarLevelConfig,
  parentName?: string,
  depth: number = 0,
): BarItem[] => {
  const result: BarItem[] = [];
  items.forEach((item) => {
    const currentItem: BarItem = {
      ...item,
      color:
        item.value >= 0 ? levelConfig?.colorPositive[depth] : levelConfig?.colorNegative[depth],
      parent: parentName,
      isChild: !!parentName,
      depth,
    };
    result.push(currentItem);
    if (expandedItems[item.name] && item.children && item.children.length > 0) {
      const children = buildProcessedData(
        item.children,
        expandedItems,
        levelConfig,
        item.name,
        depth + 1,
      );
      result.push(...children);
    }
  });
  return result;
};

// Calculate chart domains (maxValue and minValue)
const calculateChartDomains = (
  processedData: BarItem[],
): { maxValue: number; minValue: number } => {
  const values = processedData.map((item) => item.value);
  const maxValue = Math.max(...values, 0) || 1; // Default to 1 if all values are 0 or negative
  const minValue = Math.min(...values, 0) || -1; // Default to -1 if all values are 0 or positive
  return { maxValue, minValue };
};

// Main utility function to process chart data and configurations
export const processChartData = ({
  data,
  width,
  levelConfig,
  height = MIN_CHART_HEIGHT,
  baseBarHeight = BASE_BAR_HEIGHT,
  expandedItems = {},
}: PositiveAndNegativeBarChartProps & {
  width: number;
  expandedItems: Record<string, boolean>;
}): ChartConfig => {
  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return {
      processedData: [],
      chartHeight: height,
      chartMargins: getChartMargins(width),
      maxValue: 1,
      minValue: -1,
    };
  }

  // Process initial data
  const chartData = processInitialData(data, levelConfig);

  // Build processed data
  const processedData = buildProcessedData(chartData, expandedItems, levelConfig);

  // Calculate chart domains
  const { maxValue, minValue } = calculateChartDomains(processedData);

  // Calculate chart height
  const chartHeight = Math.max(processedData.length * baseBarHeight, height);

  // Calculate margins
  const chartMargins = getChartMargins(width);

  return {
    processedData,
    chartHeight,
    chartMargins,
    maxValue,
    minValue,
  };
};
