import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ContentType } from 'recharts/types/component/Tooltip';

export type TwoSideBarItem = {
  id?: string;
  name: string;
  positiveValue: number;
  negativeValue: number;
  icon?: string;
  color?: string;
  type?: string;
  parent?: string;
  children?: TwoSideBarItem[];
  isChild?: boolean;
  depth?: number;
};

export type LevelConfig = {
  totalName?: string;
  colors: {
    [depth: number]: string;
  };
};

export type PositiveAndNegativeBarChartV2Props = {
  data: TwoSideBarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  maxBarRatio?: number;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems: { name: string; color: string }[];
  tutorialText?: string;
  callback?: (item: TwoSideBarItem) => void;
  levelConfig?: LevelConfig;
  height?: number;
  baseBarHeight?: number;
  showTotal?: boolean;
  totalName?: string;
  totalColor?: string;
  callbackYAxis?: (item: TwoSideBarItem) => void;
  expanded?: boolean;
  header?: React.ReactNode;
};
