import { ChartDataConfig } from '@/components/common/positive-negative-stack-bar-chart/type';
import { getChartMargins } from '@/shared/utils/device';
import { BASE_BAR_HEIGHT, MIN_CHART_HEIGHT } from '@/shared/constants/chart';
import { CustomBarItem } from '../stacked-bar-chart/type';

const largestKey = (item: CustomBarItem): string => {
  const largestValue = Math.max(item.A, item.B, item.T);
  return largestValue === item.A ? 'A' : largestValue === item.B ? 'B' : 'T';
};

// Function to process chart data and compute configurations
export const processChartData = (
  data: CustomBarItem[],
  width: number,
  isMobile: boolean,
): ChartDataConfig => {
  // Check for negative values
  const hasNegativeValues = data.some((item) => item.A < 0 || item.T < 0 || item.B < 0);

  // Calculate positive and negative sums
  const positiveSums = data.map((item) =>
    [item.A, item.T, item.B].filter((v) => v > 0).reduce((a, b) => a + b, 0),
  );
  const maxPositive = Math.max(...positiveSums, 0);

  const negativeSums = data.map((item) =>
    [item.A, item.T, item.B].filter((v) => v < 0).reduce((a, b) => a + b, 0),
  );
  const minNegative = Math.min(...negativeSums, 0);

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
    T: item.T > 0 ? item.T : 0,
    B: item.B > 0 ? item.B : 0,
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

  return {
    hasNegativeValues,
    positiveData,
    negativeData,
    minNegative,
    maxPositive,
    chartHeight,
    negativeChartMargins,
    positiveChartMargins,
  };
};
