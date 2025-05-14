import { ChartDataConfig } from '@/components/common/positive-negative-stack-bar-chart/type';
import { getChartMargins } from '@/shared/utils/device';
import { BASE_BAR_HEIGHT, MIN_CHART_HEIGHT } from '@/shared/constants/chart';
import { CustomBarItem } from '../stacked-bar-chart/type';

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

  const maxAbs = Math.max(Math.abs(minNegative), maxPositive);

  // Prepare data for negative and positive charts
  const negativeData = data.map((item) => ({
    ...item,
    A: item.A < 0 ? item.A : 0,
    T: item.T < 0 ? item.T : 0,
    B: item.B < 0 ? item.B : 0,
  }));

  const positiveData = data.map((item) => ({
    ...item,
    A: item.A > 0 ? item.A : 0,
    T: item.T > 0 ? item.T : 0,
    B: item.B > 0 ? item.B : 0,
  }));

  // Compute chart height
  const chartHeight = Math.max(data.length * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);

  // Compute margins
  const negativeChartMargins = {
    ...getChartMargins(width),
    right: 0,
    left: 40,
  };

  const positiveChartMargins = {
    ...getChartMargins(width),
    left: isMobile ? 10 : 0,
  };

  return {
    hasNegativeValues,
    positiveData,
    negativeData,
    maxAbs,
    chartHeight,
    negativeChartMargins,
    positiveChartMargins,
  };
};
