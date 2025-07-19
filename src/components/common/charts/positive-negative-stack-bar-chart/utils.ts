import { ChartDataConfig } from '@/components/common/charts/positive-negative-stack-bar-chart/type';
import { BASE_BAR_HEIGHT, MIN_CHART_HEIGHT, STACK_KEY, STACK_TYPE } from '@/shared/constants/chart';
import { getChartMargins } from '@/shared/utils/device';
import { CustomBarItem, StackBarDisplay } from '../stacked-bar-chart/type';

const largestKey = (item: CustomBarItem): string => {
  const largestValue = Math.max(item.A, item.B, item.T);
  return largestValue === item.A
    ? STACK_KEY.A
    : largestValue === item.B
      ? STACK_KEY.B
      : STACK_KEY.T;
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
    B: item.B < 0 ? item.B : 0,
    T: item.T < 0 ? item.T : 0,
    AOriginalValue: item.A,
    BOriginalValue: item.B,
    TOriginalValue: item.T,
    maxKey: largestKey(item),
  }));

  // The priority is A, then B, then T
  const positiveData = data.map((item) => {
    // Get the largest key (A, B, T)
    const maxKey = largestKey(item);

    // Handle A value: if positive, take it, otherwise 0
    const A = item.A > 0 ? item.A : 0;

    // Handle B value:
    // If B is positive and is the largest key:
    //   If A is also positive, take the difference B - A (the part on top of A)
    //   If A is not positive, take the whole B
    // If B is positive but not the largest key, take the whole B
    // If B is not positive, take 0
    let B = 0;
    if (item.B > 0) {
      if (maxKey === STACK_KEY.B) {
        B = item.A > 0 ? item.B - item.A : item.B;
      } else {
        B = item.B;
      }
    }

    // Handle T value:
    // If T is positive and is the largest key:
    //   If B is also positive, take the difference T - B (the part on top of B)
    //   If B is not positive, take the whole T
    // If T is positive but not the largest key, take the whole T
    // If T is not positive, take 0
    let T = 0;
    if (item.T > 0) {
      if (maxKey === STACK_KEY.T) {
        T = item.B > 0 ? item.T - item.B : item.T;
      } else {
        T = item.T;
      }
    }

    return {
      ...item,
      A,
      B,
      T,
      AOriginalValue: item.A,
      BOriginalValue: item.B,
      TOriginalValue: item.T,
      maxKey,
    };
  });

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
