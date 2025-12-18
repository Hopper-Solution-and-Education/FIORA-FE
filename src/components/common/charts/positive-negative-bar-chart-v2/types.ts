import { BaseChartProps } from '@/shared/types';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ContentType } from 'recharts/types/component/Tooltip';

export type TwoSideBarItem = {
  id?: string;
  name: string;
  positiveValue: number;
  negativeValue: number;
  colorPositive?: string;
  colorNegative?: string;
  icon?: string;
  type?: string;
  parent?: string;
  children?: TwoSideBarItem[];
  isChild?: boolean;
  depth?: number;
  isOthers?: boolean;

  // field for innerbar for positive and negative
  innerBar?: TwoSideBarItem[];
};

export type PositiveAndNegativeBarV2LevelConfig = {
  totalName?: string;
  colorPositive: {
    [depth: number]: string;
  };
  colorNegative: {
    [depth: number]: string;
  };
};

export interface PositiveAndNegativeBarChartV2Props
  extends Omit<BaseChartProps<TwoSideBarItem>, 'tooltipContent' | 'legendItems'> {
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems: { name: string; color: string }[];
  maxBarRatio?: number;
  levelConfig?: PositiveAndNegativeBarV2LevelConfig;
  baseBarHeight?: number;
  showTotal?: boolean;
  totalName?: string;
  expanded?: boolean;
  header?: React.ReactNode;
  labelFormatter?: (value: number) => string;
  callbackYAxis?: (item: TwoSideBarItem) => void;
}
