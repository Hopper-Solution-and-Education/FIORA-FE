import { STACK_TYPE } from '@/shared/constants/chart';
import { TooltipProps as RechartsTooltipProps } from 'recharts';

// Types for bar item
export type CustomBarItem = {
  id?: string;
  name: string;
  icon?: string;
  type: STACK_TYPE;
  A: number;
  T: number;
  B: number;
  colors: {
    A: string;
    T: string;
    B: string;
  };
};

export type StackBarDisplay = CustomBarItem & {
  maxKey: string;
  AOriginalValue: number;
  BOriginalValue: number;
  TOriginalValue: number;
};

// Types for tooltip
export type TooltipProps = RechartsTooltipProps<number, string>;

export type StackedBarProps = {
  data?: CustomBarItem[];
  title?: string;
  icon?: string;
  currency?: string;
  locale?: string;
  isLoading?: boolean;
  callback?: (item: any) => void;
  className?: string;
  xAxisFormatter?: (value: number) => string;
  tutorialText?: string;
  legendItems?: { name: string; color: string }[];
  showButton?: boolean;
  onClickButton?: () => void;
};
