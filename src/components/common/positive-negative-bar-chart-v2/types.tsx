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

export type PositiveAndNegativeBarChartV2Props = {
  data: TwoSideBarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  maxBarRatio?: number;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems: { name: string; color: string }[];
  levelConfig?: PositiveAndNegativeBarV2LevelConfig;
  tutorialText?: string;
  height?: number;
  baseBarHeight?: number;
  showTotal?: boolean;
  totalName?: string;
  expanded?: boolean;
  header?: React.ReactNode;
  xAxisFormatter?: (value: number) => string;
  callbackYAxis?: (item: TwoSideBarItem) => void;
  callback?: (item: TwoSideBarItem) => void;
};
