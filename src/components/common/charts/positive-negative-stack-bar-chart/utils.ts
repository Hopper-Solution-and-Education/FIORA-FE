import { ChartDataConfig } from '@/components/common/charts/positive-negative-stack-bar-chart/type';
import { getChartMargins } from '@/shared/utils/device';
import { BASE_BAR_HEIGHT, MIN_CHART_HEIGHT, STACK_KEY, STACK_TYPE } from '@/shared/constants/chart';
import { CustomBarItem, StackBarDisplay } from '../stacked-bar-chart/type';

const largestKey = (item: CustomBarItem): string => {
  const largestValue = Math.max(item.A, item.T, item.B);
  return largestValue === item.A
    ? STACK_KEY.A
    : largestValue === item.T
      ? STACK_KEY.T
      : STACK_KEY.B;
};

const calculateChartDomains = (
  data: CustomBarItem[],
): { maxPositive: number; minNegative: number } => {
  // Initialize arrays to store sums of positive and negative values per item
  const positiveSums: number[] = [];
  const negativeSums: number[] = [];

  // Iterate through each item to compute sums
  for (const item of data) {
    const values = [item.A, item.T, item.B];

    // Find positive values (v > 0)
    const positiveValues = values.filter((value) => value > 0);
    positiveSums.push(...positiveValues);

    // Find negative values (v < 0)
    const negativeValues = values.filter((value) => value < 0);
    negativeSums.push(...negativeValues);
  }

  // Find the maximum positive sum and minimum negative sum
  const maxPositive = Math.max(...positiveSums, 0);
  const minNegative = Math.min(...negativeSums, 0);

  return { maxPositive, minNegative };
};

// Function to process chart data and compute configurations
export const processChartData = (
  data: CustomBarItem[],
  width: number,
  isMobile: boolean,
): ChartDataConfig => {
  // Check for negative values
  const hasNegativeValues = data.some((item) => item.A < 0 || item.T < 0 || item.B < 0);
  const { maxPositive, minNegative } = calculateChartDomains(data);

  // Prepare data for negative and positive charts
  const negativeData = data.map((item) => ({
    ...item,
    A: item.A < 0 ? item.A : 0,
    T: item.T < 0 ? item.T : 0,
    B: item.B < 0 ? item.B : 0,
    AOriginalValue: item.A,
    BOriginalValue: item.B,
    TOriginalValue: item.T,
    maxKey: largestKey(item),
  }));

  const positiveData = data.map((item) => ({
    ...item,
    A: item.A > 0 ? item.A : 0,
    T: item.T > 0 && STACK_KEY.T === largestKey(item) ? (item.A > 0 ? item.T - item.A : item.T) : 0,
    B: item.B > 0 && STACK_KEY.B === largestKey(item) ? (item.T > 0 ? item.B - item.T : item.B) : 0,
    AOriginalValue: item.A,
    BOriginalValue: item.B,
    TOriginalValue: item.T,
    maxKey: largestKey(item),
  }));

  // Compute chart height
  const chartHeight = Math.max(data.length * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);

  // Compute margins
  const negativeChartMargins = {
    ...getChartMargins(width),
    right: 0,
    left: isMobile ? 0 : 40,
  };

  const positiveChartMargins = {
    ...getChartMargins(width),
    right: isMobile ? 0 : 200,
    left: 0,
  };

  const calculateRValue = (item: StackBarDisplay): number => {
    let R: number = 0;
    switch (item.type) {
      case STACK_TYPE.EXPENSE:
        R = item.BOriginalValue - item.AOriginalValue;
        break;
      case STACK_TYPE.INCOME:
        R = item.AOriginalValue - item.BOriginalValue;
        break;
      case STACK_TYPE.PROFIT:
        R = item.AOriginalValue - item.BOriginalValue;
        break;
      default:
        break;
    }
    return R;
  };

  return {
    hasNegativeValues,
    positiveData,
    negativeData,
    minNegative,
    maxPositive,
    chartHeight,
    negativeChartMargins,
    positiveChartMargins,
    calculateRValue,
  };
};
