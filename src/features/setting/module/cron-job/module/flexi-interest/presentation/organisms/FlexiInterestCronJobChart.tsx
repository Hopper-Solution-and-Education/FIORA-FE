'use client';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { DEFAULT_CHART_FONT_SIZE, DEFAULT_CHART_TICK_COUNT } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useAppDispatch, useAppSelector } from '@/store';
import { FC, useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useIsMobile } from '../hooks/useIsMobile';
import { useGetFlexiInterestStatisticsQuery } from '../services/flexi-interest.service';
import { setFilter } from '../slices';
import { FlexiInterestStatistics } from '../slices/type';

interface FlexiInterestCronJobChartProps {
  title?: string;
  height?: number;
  currency?: string;
  xAxisFormatter?: (value: string) => string;
  yAxisFormatter?: (value: number) => string;
  fontSize?: typeof DEFAULT_CHART_FONT_SIZE;
  tickCount?: number;
  showTotal?: boolean;
  totalLabel?: string;
}

const FlexiInterestCronJobChart: FC<FlexiInterestCronJobChartProps> = (props) => {
  const { formatCurrency } = useCurrencyFormatter();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.flexiInterestCronjob);

  const handleBarClick = (data: any) => {
    console.log(data);
    if (data && data.id) {
      dispatch(
        setFilter({
          status: null,
          search: null,
          email: null,
          tierName: [data.id],
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
    }, 100);
  };

  const truncateText = (text: string, maxLength: number = 10) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const {
    title = 'Flexi Interest Chart',
    height = isMobile ? 300 : 450,
    currency = '',
    xAxisFormatter = (value: string) => truncateText(value, isMobile ? 8 : 12),
    yAxisFormatter = (value: number) => formatCurrency(value, currency),
    fontSize = DEFAULT_CHART_FONT_SIZE ?? 12,
    tickCount = isMobile ? 5 : DEFAULT_CHART_TICK_COUNT,
    showTotal = true,
    totalLabel = 'Total',
  } = props;
  const axisFontSize = fontSize.axis ?? 12;
  const legendFontSize = fontSize.legend ?? 12;
  const titleFontSize = fontSize.title ?? 14;
  const tooltipFontSize = fontSize.tooltip ?? 12;

  const { data: rawData, isLoading, error } = useGetFlexiInterestStatisticsQuery();

  const chartData: FlexiInterestStatistics | null = useMemo(() => {
    if (!rawData || !rawData.tierInterestAmount || !Array.isArray(rawData.tierInterestAmount)) {
      return null;
    }

    const transformedData = rawData.tierInterestAmount.map((item: any) => {
      const isSelected = filter.tierName?.includes(item.tierName);
      return {
        id: item.tierId,
        name: item.tierName,
        amount: parseFloat(item.interestAmount) || 0,
        fill: isSelected ? '#ee4d4dff' : '#FF8383', // Highlight selected bar
      };
    });

    return {
      chartData: transformedData,
      totalAmount: parseFloat(rawData.totalInterestAmount) || 0,
    };
  }, [rawData]);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  if (!chartData || chartData.chartData.length === 0) {
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
    <Card className={`mx-4 border rounded-2xl ${isMobile ? 'h-[350px]' : 'h-[500px]'} `}>
      <CardHeader className="relative">
        {showTotal && (
          <CardDescription
            className="absolute top-5 right-10 px-3 py-2 bg-gray-100 text-blue-600 font-semibold rounded-lg"
            style={{ fontSize: `${isMobile ? titleFontSize - 8 : titleFontSize}px` }}
          >
            {totalLabel}:{' '}
            <span className="text-blue-600 font-semibold">
              {formatCurrency(chartData.totalAmount, currency)} FX
            </span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData.chartData}
            margin={{
              top: isMobile ? 25 : 30,
              right: isMobile ? 5 : 10,
              bottom: isMobile ? 40 : 55,
              left: isMobile ? 0 : 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              angle={isMobile ? -45 : -45}
              textAnchor="end"
              height={isMobile ? 60 : 80}
              interval={0}
              fontSize={`${isMobile ? axisFontSize - 4 : axisFontSize}px`}
              tickFormatter={xAxisFormatter}
            />
            <YAxis
              tickCount={tickCount}
              tickFormatter={yAxisFormatter}
              fontSize={`${isMobile ? axisFontSize - 4 : axisFontSize}px`}
              label={{
                value: 'Amount',
                position: 'top',
                offset: isMobile ? 10 : 20,
                style: {
                  textAnchor: 'middle',
                  fontSize: `${isMobile ? legendFontSize - 4 : legendFontSize}px`,
                  fontWeight: 'bold',
                },
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [`${yAxisFormatter(value)} FX`, name]}
              labelStyle={{
                color: '#000',
                fontSize: isMobile ? tooltipFontSize - 2 : tooltipFontSize,
              }}
              itemStyle={{
                color: '#ee4d4dff',
                fontSize: isMobile ? tooltipFontSize - 2 : tooltipFontSize,
              }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                fontSize: isMobile ? tooltipFontSize - 2 : tooltipFontSize,
                maxWidth: isMobile ? '200px' : 'none',
              }}
              cursor={{
                strokeWidth: 1,
                strokeDasharray: '4 4',
                className: 'dark:fill-gray-100 dark:stroke-gray-600 transition-all duration-300',
              }}
            />
            <Bar
              dataKey="amount"
              fill="#FF8383"
              radius={[4, 4, 0, 0]}
              animationDuration={400}
              animationEasing="ease-out"
              activeBar={{
                fill: '#ee4d4dff',
                stroke: '#ffffff',
                strokeWidth: 2,
                filter: 'brightness(1.3) drop-shadow(0 0 5px rgba(0,0,0,0.2))',
                cursor: 'pointer',
              }}
              onClick={handleBarClick}
              cursor={'pointer'}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FlexiInterestCronJobChart;
