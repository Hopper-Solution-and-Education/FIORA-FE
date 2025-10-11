'use client';

import { ChartLegend } from '@/components/common/atoms';
import { ChartSkeleton } from '@/components/common/organisms';

import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import {
  COLORS,
  DEFAULT_CHART_FONT_SIZE,
  DEFAULT_CHART_TICK_COUNT,
  DEFAULT_CURRENCY,
} from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { ColumnConfig, LineConfig, TooltipProps } from '@/shared/types/chart.type';
import { cn, isImageUrl } from '@/shared/utils';
import { findMaxMinValues } from '@/shared/utils/chart';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import Image from 'next/image';
import { memo, useCallback, useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { CommonTooltip } from '../../atoms/CommonTooltip';
import { DEFAULT_COMPOSED_CHART_HEIGHT, DEFAULT_COMPOSED_CHART_ITEM_WIDTH } from './constant';
import { ComposedChartProps } from './type';

export const renderIconOrImage = (iconValue?: string) => {
  if (!iconValue) return null;

  if (isImageUrl(iconValue)) {
    return (
      <div className="w-5 h-5 rounded-full overflow-hidden">
        <Image
          src={iconValue}
          alt="icon"
          width={20}
          height={20}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.classList.add(
              'flex',
              'items-center',
              'justify-center',
              'bg-gray-100',
            );
            const fallbackIcon = document.createElement('div');
            fallbackIcon.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>';
            e.currentTarget.parentElement?.appendChild(fallbackIcon.firstChild as Node);
          }}
        />
      </div>
    );
  }

  return <LucieIcon icon={iconValue} className="w-4 h-4" />;
};

const ComposedChartComponent = (props: ComposedChartProps) => {
  const { formatCurrency } = useCurrencyFormatter();
  const {
    data = [],
    title,
    callback,
    className,
    columns,
    lines,
    yAxisFormatter = (value: number) => formatCurrency(value, currency),
    isLoading = false,
    showLegend = true,
    currency = DEFAULT_CURRENCY,
    height = DEFAULT_COMPOSED_CHART_HEIGHT,
    fontSize = DEFAULT_CHART_FONT_SIZE,
    tickCount = DEFAULT_CHART_TICK_COUNT,
    tooltipFormatter,
  } = props;
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  const labelsDistance = useMemo(() => {
    const availableWidth = width - (chartMargins.left + chartMargins.right);
    const averageWidth = availableWidth / data.length;
    return {
      shouldRotateLabels: averageWidth < 250,
      shouldTruncate: averageWidth < 300,
      averageWidth,
    };
  }, [width, chartMargins, data.length]);

  const legendItems = useMemo(() => {
    const items = [
      ...columns.map((col) => ({
        name: col.name,
        color: col.color,
        icon: col.icon,
      })),
      ...(lines?.map((line) => ({
        name: line.name,
        color: line.color,
      })) || []),
    ];
    return items;
  }, [columns, lines]);

  const { maxValue, minValue } = useMemo(() => {
    const columnsMaxMin = findMaxMinValues(data, columns);

    let linesMax = 0;
    let linesMin = 0;

    if (lines && lines.length > 0) {
      data.forEach((item) => {
        lines.forEach((line) => {
          const value = item[line.key] as number;
          if (value > 0 && value > linesMax) linesMax = value;
          if (value < 0 && value < linesMin) linesMin = value;
        });
      });
    }

    const finalMax = Math.max(columnsMaxMin.maxValue, linesMax);
    const finalMin = Math.min(columnsMaxMin.minValue, linesMin);

    return { maxValue: finalMax, minValue: finalMin };
  }, [data, columns, lines]);

  const renderTooltipContent = (props: TooltipProps) => {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const customContent = tooltipFormatter?.(payload[0].payload);
    if (customContent) return customContent;

    return (
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
        <p
          className="text-sm font-medium text-gray-800 dark:text-gray-200"
          style={{ fontSize: fontSize.tooltip }}
        >
          {label}
        </p>
        {payload.map((entry: Payload<number, string>, index: number) => {
          const column = columns.find((col) => col.key === entry.dataKey);
          return (
            <div
              key={index}
              className="flex items-center text-gray-600 dark:text-gray-400 mt-1"
              style={{ fontSize: (fontSize.tooltip as number) - 2 }}
            >
              <div className="flex items-center gap-2">
                {column?.icon && renderIconOrImage(column.icon)}
                <div
                  className="w-3 h-3 mr-2 rounded-sm"
                  style={{ backgroundColor: entry.color || '#cccccc' }}
                />
              </div>
              <span>{entry.name}:</span>
              <span className="font-bold ml-1">{yAxisFormatter(entry.value as number)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleChartClick = useCallback(
    (data: any) => {
      if (callback && data && data.activePayload) {
        callback(data.activePayload[0].payload);
      }
    },
    [callback],
  );

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200',
        className,
      )}
    >
      {title && (
        <div className="flex justify-start items-center gap-4 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        </div>
      )}

      {isMobile && showLegend && <ChartLegend items={legendItems} />}

      <div className={cn('overflow-x-auto', !isMobile && 'overflow-x-hidden')}>
        <div
          style={{
            minWidth: isMobile ? Math.max(width * 0.8, data.length * 100) : '100%',
            width: isMobile ? 'auto' : '100%',
          }}
        >
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ bottom: 30, top: 30 }} onClick={handleChartClick}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
                className="dark:stroke-gray-600 transition-colors duration-200"
              />
              {data.some((item) => item.icon) ? (
                <XAxis
                  dataKey="name"
                  tick={({ x, y, payload }) => {
                    const item = data.find((d) => d.name === String(payload.value));
                    const balance = typeof item?.balance === 'number' ? item.balance : 0;
                    const isNegative = balance < 0;

                    return (
                      <g transform={`translate(${x},${y})`}>
                        <foreignObject x={-20} y={5} width={35} height={35}>
                          <CommonTooltip content={item?.name}>
                            <div
                              className={cn(
                                'w-full h-full rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105',
                                isNegative
                                  ? 'bg-warning/10 dark:bg-warning/20'
                                  : 'bg-gray-100 dark:bg-gray-800',
                              )}
                            >
                              <div
                                className={cn(
                                  'w-5 h-5 flex items-center justify-center',
                                  isNegative ? 'text-warning' : 'text-gray-600 dark:text-gray-400',
                                )}
                              >
                                {renderIconOrImage(item?.icon ?? 'user')}
                              </div>
                            </div>
                          </CommonTooltip>
                        </foreignObject>
                      </g>
                    );
                  }}
                  angle={labelsDistance.shouldRotateLabels ? -40 : 0}
                  height={labelsDistance.shouldRotateLabels ? 60 : 30}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                  interval={0}
                />
              ) : (
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => {
                    if (labelsDistance.shouldRotateLabels) {
                      return value.length > 12 ? value.substring(0, 12) + '...' : value;
                    }
                    if (value.length > 25 || labelsDistance.shouldTruncate) {
                      return value.length > 15 ? value.substring(0, 15) + '...' : value;
                    }
                    return value;
                  }}
                  tick={{
                    fill: 'gray',
                    fontSize: fontSize.axis,
                    textAnchor: labelsDistance.shouldRotateLabels ? 'end' : 'middle',
                  }}
                  angle={labelsDistance.shouldRotateLabels ? -40 : 0}
                  height={labelsDistance.shouldRotateLabels ? 60 : 30}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                  interval={0}
                  style={{
                    fontSize: isMobile ? (fontSize.axis as number) - 1 : fontSize.axis,
                  }}
                />
              )}
              <YAxis
                tickFormatter={yAxisFormatter}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                domain={[minValue, maxValue]}
                tickCount={tickCount}
                width={80}
                style={{
                  fontSize: isMobile ? (fontSize.axis as number) - 1 : fontSize.axis,
                }}
              />
              <ReferenceLine y={0} stroke="#E5E7EB" className="dark:stroke-gray-600" />
              <Tooltip
                cursor={{
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                  className: 'dark:fill-gray-100 dark:stroke-gray-600 transition-all duration-300',
                }}
                content={renderTooltipContent}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  if (!item?.icon) return null;

                  return (
                    <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {item.name}
                      </p>
                    </div>
                  );
                }}
              />

              {columns.map((column: ColumnConfig, index: number) => (
                <Bar
                  key={`bar-${index}`}
                  dataKey={column.key}
                  name={column.name}
                  fill={column.color}
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                  animationDuration={400}
                  stackId={column.stackId}
                  animationEasing="ease-out"
                  activeBar={{
                    stroke: '#ffffff',
                    strokeWidth: 2,
                    filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                    cursor: 'pointer',
                  }}
                  maxBarSize={DEFAULT_COMPOSED_CHART_ITEM_WIDTH}
                >
                  {data.map((entry, i) => {
                    if (column.customCell) {
                      return column.customCell(entry, i);
                    }
                    const value = entry[column.key];
                    const numericValue = typeof value === 'number' ? value : 0;
                    const isNegative = numericValue < 0;
                    const baseColor = isNegative ? COLORS.DEPS_WARNING.LEVEL_2 : column.color;
                    return <Cell key={`cell-${i}`} fill={baseColor} />;
                  })}
                </Bar>
              ))}

              {lines &&
                lines.map((line: LineConfig, index: number) => (
                  <Line
                    key={`line-${index}`}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={{
                      r: 4,
                      fill: line.color,
                      strokeWidth: 1,
                      stroke: '#ffffff',
                    }}
                    activeDot={{
                      r: 6,
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      fill: line.color,
                      filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                    }}
                  />
                ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {!isMobile && showLegend && <ChartLegend items={legendItems} />}
    </div>
  );
};

export default memo(ComposedChartComponent);
