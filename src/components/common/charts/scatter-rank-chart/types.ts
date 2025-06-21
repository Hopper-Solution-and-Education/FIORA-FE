export interface LegendItem {
  name: string;
  color?: string;
}

export interface ScatterChartProps {
  currentTier: {
    balance?: number;
    spent?: number;
  };
  balanceTiers: Tier[];
  spentTiers: Tier[];
  title?: string;
  className?: string;
  barColors?: {
    xBg?: string;
    x?: string;
    yBg?: string;
    y?: string;
  };
  xLegend?: any;
  yLegend?: any;
  combinedTierIcons?: Record<string, CombinedTierIcon>;
  cellRenderer?: (
    balanceTier: Tier,
    spentTier: Tier,
    isCurrent: boolean,
    bIndex: number,
    sIndex: number,
    handleClick?: () => void,
  ) => React.ReactNode;
  customTooltipContent?: (bTier: Tier, sTier: Tier) => React.ReactNode;
}

export interface Tier {
  label: string;
  min: number;
  max: number;
  value: number;
  icon: string;
}

export const defaultBarColors = {
  xBg: '#ccc', // grey
  x: '#000', // black
  yBg: '#ccc', // grey
  y: '#000', // black
};

export interface LegendProps {
  items: LegendItem[];
  className?: string;
}

export type ItemRankChartProps = {
  bTier: Tier;
  sTier: Tier;
  isCurrent: boolean;
  bIndex: number;
  sIndex: number;
  combinedTierIcons?: Record<string, CombinedTierIcon>;
  customTooltipContent?: (bTier: Tier, sTier: Tier) => React.ReactNode;
};

export interface CombinedTierIcon {
  icon: string;
  inActiveIcon?: string;
  isActive?: boolean;
  onClick?: (balanceTier: Tier, spentTier: Tier) => void;
}

export interface ProgressBarChartProps {
  currentTier: {
    balance?: number;
    spent?: number;
  };
  chartDimensions: { width: number; height: number };
  balanceTiers: any[];
  spentTiers: any[];
  colors: any;
  getXAxisPosition: (value: number) => number;
  getYAxisPosition: (value: number) => number;
}
