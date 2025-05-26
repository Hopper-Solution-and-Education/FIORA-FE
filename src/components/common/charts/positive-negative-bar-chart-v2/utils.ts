import {
  PositiveAndNegativeBarV2LevelConfig,
  TwoSideBarItem,
} from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { COLORS } from '@/shared/constants/chart';

export const getTotalItem = (
  data: TwoSideBarItem[],
  totalName: string,
  levelConfig?: PositiveAndNegativeBarV2LevelConfig,
): TwoSideBarItem => {
  const totalPositive = data.reduce((sum, item) => sum + (item.positiveValue || 0), 0);
  const totalNegative = data.reduce((sum, item) => sum + (item.negativeValue || 0), 0);
  return {
    id: undefined,
    name: totalName,
    positiveValue: totalPositive,
    negativeValue: totalNegative,
    colorPositive: levelConfig?.colorPositive[0] || COLORS.DEPS_SUCCESS.LEVEL_2,
    colorNegative: levelConfig?.colorNegative[0] || COLORS.DEPS_DANGER.LEVEL_2,
    type: 'total',
    depth: 0,
    isChild: false,
  };
};

export const prepareChartData = (
  data: TwoSideBarItem[],
  showAll: boolean,
  showTotal: boolean,
  totalName: string,
  levelConfig?: PositiveAndNegativeBarV2LevelConfig,
): TwoSideBarItem[] => {
  let items = data;
  if (!showAll && data.length > 5) {
    const first5 = data.slice(0, 5);
    const others = data.slice(5);
    const othersTotal = others.reduce(
      (acc, item) => ({
        positiveValue: acc.positiveValue + (item.positiveValue || 0),
        negativeValue: acc.negativeValue + (item.negativeValue || 0),
      }),
      { positiveValue: 0, negativeValue: 0 },
    );
    items = [
      ...first5,
      {
        id: undefined,
        name: `Others (${others.length} items)`,
        positiveValue: othersTotal.positiveValue,
        negativeValue: othersTotal.negativeValue,
        icon: 'expand',
        type: 'others',
        colorPositive: COLORS.DEPS_SUCCESS.LEVEL_2,
        colorNegative: COLORS.DEPS_DANGER.LEVEL_2,
        isOthers: true,
      },
    ];
  }
  if (showTotal) {
    const totalItem = getTotalItem(data, totalName, levelConfig);
    return [totalItem, ...items];
  }
  return items;
};

export const buildProcessedData = (
  items: TwoSideBarItem[],
  expandedItems: Record<string, boolean>,
  levelConfig?: PositiveAndNegativeBarV2LevelConfig,
  depth: number = 0,
  parent?: string,
): TwoSideBarItem[] => {
  const result: TwoSideBarItem[] = [];
  items.forEach((item) => {
    const currentItem: TwoSideBarItem = {
      ...item,
      colorPositive:
        levelConfig?.colorPositive[depth] || item.colorPositive || COLORS.DEPS_SUCCESS.LEVEL_2,
      colorNegative:
        levelConfig?.colorNegative[depth] || item.colorNegative || COLORS.DEPS_DANGER.LEVEL_2,
      depth,
      parent,
      isChild: !!parent,
    };
    result.push(currentItem);
    if (expandedItems[item.name] && item.children && item.children.length > 0) {
      const children = buildProcessedData(
        item.children,
        expandedItems,
        levelConfig,
        depth + 1,
        item.name,
      );
      result.push(...children);
    }
  });
  return result;
};

export const calculateChartDomains = (
  visibleData: TwoSideBarItem[],
): { minNegative: number; maxPositive: number } => {
  const negativeValues = visibleData.map((item) => item.negativeValue || 0);
  const positiveValues = visibleData.map((item) => item.positiveValue || 0);
  const minNegative = Math.min(...negativeValues, 0) || -1; // Default to -1 if no negative values
  const maxPositive = Math.max(...positiveValues, 0) || 1; // Default to 1 if no positive values
  return { minNegative, maxPositive };
};

export const calculateMainBarCount = (dataLength: number, showAll: boolean): number => {
  if (showAll) return dataLength;
  return Math.min(dataLength, 5) + (dataLength > 5 ? 1 : 0);
};

export const calculateChartVisibility = (
  visibleData: TwoSideBarItem[],
): { showPositiveChart: boolean; showNegativeChart: boolean; isBothEmpty: boolean } => {
  const allPositiveZero = visibleData.every((item) => (item.positiveValue || 0) === 0);
  const allNegativeZero = visibleData.every((item) => (item.negativeValue || 0) === 0);
  const isBothEmpty = allPositiveZero && allNegativeZero;
  return {
    showPositiveChart: !allPositiveZero,
    showNegativeChart: !allNegativeZero,
    isBothEmpty: isBothEmpty,
  };
};
