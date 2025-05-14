import { CustomBarItem } from '../stacked-bar-chart/type';

export interface ChartDataConfig {
  hasNegativeValues: boolean;
  positiveData: CustomBarItem[];
  negativeData: CustomBarItem[];
  maxAbs: number;
  chartHeight: number;
  negativeChartMargins: object;
  positiveChartMargins: object;
}

export interface PositiveNegativeStackBarChartProps {
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
  onClickTitle?: () => void;
}
