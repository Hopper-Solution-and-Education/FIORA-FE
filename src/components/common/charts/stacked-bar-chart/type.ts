import { STACK_TYPE } from '@/shared/constants';
import { BaseChartProps } from '@/shared/types';
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

export interface StackedBarProps extends Omit<BaseChartProps<CustomBarItem>, 'data'> {
  data?: CustomBarItem[];
  icon?: string;
  showButton?: boolean;
  onClickButton?: () => void;
  onClickTitle?: () => void;
}
