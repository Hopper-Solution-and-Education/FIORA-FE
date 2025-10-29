'use client';
import { ComposedChartDataItem } from '@/components/common/charts';
import ComposedChartComponent from '@/components/common/charts/composed-chart';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { DEFAULT_CHART_FONT_SIZE, DEFAULT_CHART_TICK_COUNT } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useDeviceDetect } from '@/shared/hooks/useIsMobile';
import { useAppDispatch, useAppSelector } from '@/store';
import { FC, useMemo } from 'react';
import { Cell } from 'recharts';
import { useGetFlexiInterestStatisticsQuery } from '../services/flexi-interest.service';
import { setFilter } from '../slices';
import { FlexiInterestChartDataItem, TierInterestAmount } from '../types/flexi-interest.type';

interface FlexiInterestCronJobChartProps {
  height?: number;
  currency?: string;
  yAxisFormatter?: (value: number) => string;
  fontSize?: typeof DEFAULT_CHART_FONT_SIZE;
  tickCount?: number;
  showTotal?: boolean;
  totalLabel?: string;
}

const CHART_COLORS = {
  DEFAULT: '#FF8383',
  SELECTED: '#ee4d4dff',
} as const;

const CHART_HEIGHT = {
  MOBILE: 300,
  DESKTOP: 450,
} as const;

const TOTAL_LABEL_FONT_SIZE = {
  MOBILE_OFFSET: 6,
} as const;

const SCROLL_DELAY_MS = 100;

const FlexiInterestCronJobChart: FC<FlexiInterestCronJobChartProps> = (props) => {
  const { formatCurrency } = useCurrencyFormatter();
  const { isMobile } = useDeviceDetect();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.flexiInterestCronjob);

  const {
    height = isMobile ? CHART_HEIGHT.MOBILE : CHART_HEIGHT.DESKTOP,
    currency = '',
    yAxisFormatter = (value: number) => formatCurrency(value, currency),
    fontSize = DEFAULT_CHART_FONT_SIZE ?? 12,
    tickCount = isMobile ? 5 : DEFAULT_CHART_TICK_COUNT,
    showTotal = true,
    totalLabel = 'Total',
  } = props;

  const { data: rawData, isLoading, error } = useGetFlexiInterestStatisticsQuery();

  // Calculate total label font size
  const calculateFontSize = (isMobile: boolean, baseFontSize: number): number => {
    return isMobile ? baseFontSize - TOTAL_LABEL_FONT_SIZE.MOBILE_OFFSET : baseFontSize;
  };

  const totalLabelFontSize = useMemo(() => {
    const baseFontSize = fontSize?.title ?? DEFAULT_CHART_FONT_SIZE.title ?? 12;
    return calculateFontSize(isMobile, baseFontSize);
  }, [fontSize, isMobile]);

  const { chartData, totalAmount } = useMemo(() => {
    if (!rawData?.tierInterestAmount?.length) {
      return { chartData: [], totalAmount: 0 };
    }

    const transformedData: FlexiInterestChartDataItem[] = rawData.tierInterestAmount
      .map((item: TierInterestAmount) => ({
        id: item.tierId,
        name: item.tierName,
        amount: parseFloat(item.interestAmount) || 0,
      }))
      .sort((a: FlexiInterestChartDataItem, b: FlexiInterestChartDataItem) => b.amount - a.amount);

    return {
      chartData: transformedData,
      totalAmount: parseFloat(rawData.totalInterestAmount) || 0,
    };
  }, [rawData]);

  const columns = useMemo(
    () => [
      {
        key: 'amount',
        name: 'Amount',
        color: CHART_COLORS.DEFAULT,
        customCell: (entry: FlexiInterestChartDataItem, index: number) => {
          const isSelected = filter.tierName?.includes(entry.id as string);
          return (
            <Cell
              key={`cell-${index}`}
              fill={isSelected ? CHART_COLORS.SELECTED : CHART_COLORS.DEFAULT}
            />
          );
        },
      },
    ],
    [filter.tierName],
  );

  const handleBarClick = (data: ComposedChartDataItem) => {
    if (data && data.id) {
      dispatch(
        setFilter({
          status: null,
          search: null,
          email: null,
          tierName: [data.id as string],
          emailUpdateBy: null,
          fromDate: null,
          toDate: null,
        }),
      );
    }

    setTimeout(() => {
      const tableContainer = document.getElementById('flexi-interest-table-container');
      if (tableContainer) {
        tableContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, SCROLL_DELAY_MS);
  };

  if (error) {
    console.error('Error loading chart data:', error);
    return (
      <Card>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-red-500">
            Error loading chart data
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && chartData && chartData?.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mx-4 border rounded-2xl ${isMobile ? 'h-[350px]' : 'h-[500px]'}`}>
      <CardHeader className="relative">
        {showTotal && (
          <CardDescription
            className="absolute top-5 right-10 px-3 py-2 bg-gray-100 text-blue-600 font-semibold rounded-lg"
            style={{ fontSize: `${totalLabelFontSize}px` }}
          >
            {totalLabel}: {formatCurrency(totalAmount, currency)} FX
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-full w-full">
        <ComposedChartComponent
          data={chartData}
          columns={columns}
          callback={handleBarClick}
          isLoading={isLoading}
          showLegend={false}
          currency={currency}
          height={height}
          fontSize={fontSize}
          tickCount={tickCount}
          yAxisFormatter={yAxisFormatter}
          sortEnable={false}
          className="border-none shadow-none p-0"
        />
      </CardContent>
    </Card>
  );
};

export default FlexiInterestCronJobChart;
