'use client';

import {
  ChartLegend,
  CustomYAxisTick,
  PositiveAndNegativeV2BarLabel,
  PositiveAndNegativeV2Tooltip,
} from '@/components/common/atoms';
import { PositiveAndNegativeBarChartV2Props } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { ChartSkeleton } from '@/components/common/organisms';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import {
  BASE_BAR_HEIGHT,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  MIN_CHART_HEIGHT,
} from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { Currency } from '@/shared/types';
import { cn } from '@/shared/utils';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { sortChartData } from '../utils/sortChartData';
import {
  buildProcessedData,
  calculateChartDomains,
  calculateChartVisibility,
  calculateMainBarCount,
  prepareChartData,
} from './utils';

const PositiveAndNegativeBarChartV2 = (props: PositiveAndNegativeBarChartV2Props) => {
  const { formatCurrency } = useCurrencyFormatter();
  const {
    data,
    title,
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    xAxisFormatter = (value) => formatCurrency(value, currency as Currency),
    tooltipContent,
    legendItems,
    tutorialText,
    callback,
    levelConfig,
    height = MIN_CHART_HEIGHT,
    baseBarHeight = BASE_BAR_HEIGHT,
    showTotal = false,
    totalName = 'Total',
    expanded = true,
    header,
    labelFormatter,
    sortEnable = true,
  } = props;

  // Sort data if sortEnable is true (highest values first - top to bottom for horizontal chart)
  const sortedData = useMemo(
    () =>
      sortChartData(data, sortEnable, (d) =>
        [...d].sort((a, b) => {
          const aTotal = Math.abs(a.positiveValue) + Math.abs(a.negativeValue);
          const bTotal = Math.abs(b.positiveValue) + Math.abs(b.negativeValue);
          return bTotal - aTotal;
        }),
      ),
    [data, sortEnable],
  );

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chartHeight, setChartHeight] = useState(height);
  const [showAll, setShowAll] = useState(false);
  const [isLoadingViewAll, setIsLoadingViewAll] = useState(false);
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const BAR_GAP = 0;
  const BAR_CATEGORY_GAP = 10;

  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  const handleToggleShowAll = useCallback(() => {
    setIsLoadingViewAll(true);
    setTimeout(() => {
      setShowAll((prev) => !prev);
      setIsLoadingViewAll(false);
    }, 200);
  }, []);

  const preparedData = useMemo(
    () => prepareChartData(sortedData, showAll, showTotal, totalName, levelConfig),
    [sortedData, showAll, showTotal, totalName, levelConfig],
  );

  const mainBarCount = useMemo(
    () => calculateMainBarCount(sortedData.length, showAll),
    [sortedData.length, showAll],
  );

  useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      [totalName]: expanded,
    }));
  }, [expanded, totalName]);

  const visibleData = useMemo(
    () => buildProcessedData(preparedData, expandedItems, levelConfig),
    [preparedData, expandedItems, levelConfig],
  );

  const { minNegative, maxPositive } = useMemo(
    () => calculateChartDomains(visibleData),
    [visibleData],
  );

  const { showPositiveChart, showNegativeChart, isBothEmpty } = useMemo(
    () => calculateChartVisibility(visibleData),
    [visibleData],
  );

  useEffect(() => {
    const numBars = visibleData.length;
    const newHeight = Math.max(numBars * baseBarHeight, height);
    setChartHeight(newHeight);
  }, [visibleData, baseBarHeight, height]);

  const negativeChartMargins = useMemo(
    () => ({
      ...getChartMargins(width),
      right: 0,
      left: 40,
    }),
    [width],
  );

  const positiveChartMargins = useMemo(
    () => ({
      ...getChartMargins(width),
      left: isMobile ? 10 : 0,
    }),
    [width, isMobile],
  );

  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <PositiveAndNegativeV2Tooltip
        {...props}
        currency={currency}
        locale={locale}
        tutorialText={tutorialText}
        formatter={xAxisFormatter}
      />
    ),
    [currency, locale, tutorialText, xAxisFormatter],
  );

  const renderSkeleton = () => <ChartSkeleton />;

  return (
    <div className="w-full transition-colors rounded-lg py-4 duration-200">
      <div className="flex justify-between items-center mb-4">
        {header || (
          <>
            {title && (
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {mainBarCount} of {data.length} items
              </span>

              {data.length > 5 && (
                <CommonTooltip content={showAll ? 'Show Less' : 'View All'}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleShowAll}
                    className="h-8 w-8 hover:bg-primary/10 relative"
                    disabled={isLoadingViewAll}
                  >
                    {isLoadingViewAll ? (
                      <Icons.spinner className="h-5 w-5 text-primary animate-spin" />
                    ) : showAll ? (
                      <Icons.shrink
                        className={cn(
                          'h-5 w-5 transition-colors duration-200 text-primary dark:text-gray-400',
                        )}
                      />
                    ) : (
                      <Icons.expand
                        className={cn(
                          'h-5 w-5 transition-colors duration-200 text-primary dark:text-gray-400',
                        )}
                      />
                    )}
                  </Button>
                </CommonTooltip>
              )}
            </div>
          </>
        )}
      </div>
      {isMobile && <ChartLegend items={legendItems} />}
      <div
        style={{ height: `${chartHeight}px` }}
        className="transition-all duration-300 flex flex-col md:flex-row"
      >
        {isLoadingViewAll ? (
          renderSkeleton()
        ) : (
          <>
            {(isBothEmpty || showNegativeChart) && (
              <ResponsiveContainer
                width="100%"
                height={chartHeight}
                className={showPositiveChart ? 'md:w-1/2' : 'md:w-full'}
              >
                <BarChart
                  data={visibleData}
                  layout="vertical"
                  margin={negativeChartMargins}
                  barCategoryGap={BAR_CATEGORY_GAP}
                  barGap={BAR_GAP}
                  className="transition-all duration-300"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    className="dark:stroke-gray-600 transition-colors duration-200"
                  />
                  <XAxis
                    type="number"
                    domain={[minNegative, 0]}
                    tickFormatter={(value) => xAxisFormatter(Math.abs(value))}
                    className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                    tick={(props) => (
                      <CustomYAxisTick
                        {...props}
                        processedData={visibleData}
                        expandedItems={expandedItems}
                        onToggleExpand={toggleExpand}
                        callback={callback}
                        setShowAll={handleToggleShowAll}
                      />
                    )}
                  />
                  <Tooltip
                    trigger="hover"
                    content={tooltipContent || customTooltipWithConfig}
                    cursor={false}
                  />

                  {/* inner bar for negative - render FIRST so it appears at the bottom */}
                  {visibleData.map((entry, index) => {
                    const innerValue = entry.innerBar?.[index]?.negativeValue || 0;
                    return (
                      <Bar
                        key={`inner-bar-${index}`}
                        dataKey={`innerBar[${index}].negativeValue`}
                        stackId="a"
                        label={
                          innerValue !== 0
                            ? (props: any) => (
                                <PositiveAndNegativeV2BarLabel
                                  {...props}
                                  value={innerValue}
                                  formatter={labelFormatter}
                                />
                              )
                            : false
                        }
                        fill={entry.innerBar?.[index]?.colorNegative}
                      >
                        {entry.innerBar?.map((innerEntry, innerIndex) => (
                          <Cell key={`inner-cell-${innerIndex}`} fill={innerEntry.colorNegative} />
                        ))}
                      </Bar>
                    );
                  })}
                  <Bar
                    stackId="a"
                    radius={[0, 4, 4, 0]}
                    dataKey="negativeValue"
                    activeBar={{
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                      cursor: 'pointer',
                    }}
                    label={(props) => {
                      // Use the actual negativeValue instead of the stacked total
                      const actualValue = visibleData[props.index]?.negativeValue || 0;
                      return (
                        <PositiveAndNegativeV2BarLabel
                          {...props}
                          value={actualValue}
                          formatter={labelFormatter}
                        />
                      );
                    }}
                    onClick={(props) => {
                      const item = props.payload;
                      if (item.isOthers) {
                        handleToggleShowAll();
                      } else if (callback) {
                        callback(item);
                      }
                    }}
                    className="transition-all duration-300 cursor-pointer"
                  >
                    {visibleData.map((entry, index) => (
                      <Cell key={`negative-cell-${index}`} fill={entry.colorNegative} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {(isBothEmpty || showPositiveChart) && (
              <ResponsiveContainer
                width="100%"
                height={chartHeight}
                className={cn(showNegativeChart ? 'md:w-1/2' : 'md:w-full', isMobile && 'mt-10')}
              >
                <BarChart
                  data={visibleData}
                  layout="vertical"
                  margin={positiveChartMargins}
                  barCategoryGap={BAR_CATEGORY_GAP}
                  barGap={BAR_GAP}
                  className="transition-all duration-300"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    className="dark:stroke-gray-600 transition-colors duration-200"
                  />
                  <XAxis
                    type="number"
                    domain={[0, maxPositive]}
                    tickFormatter={(value) => xAxisFormatter(Math.abs(value))}
                    className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={isMobile ? 70 : showPositiveChart && !showNegativeChart ? 100 : 0}
                    className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                    tick={(props) => (
                      <CustomYAxisTick
                        {...props}
                        processedData={visibleData}
                        expandedItems={expandedItems}
                        onToggleExpand={toggleExpand}
                        callback={callback}
                        setShowAll={handleToggleShowAll}
                      />
                    )}
                  />
                  <Tooltip
                    trigger="hover"
                    content={tooltipContent || customTooltipWithConfig}
                    cursor={false}
                  />

                  {/* inner bar for positive - render FIRST so it appears at the bottom */}
                  {visibleData.map((entry, index) => {
                    const innerValue = entry.innerBar?.[index]?.positiveValue || 0;
                    return (
                      <Bar
                        key={`inner-bar-${index}`}
                        dataKey={`innerBar[${index}].positiveValue`}
                        stackId="a"
                        label={
                          innerValue > 0
                            ? (props: any) => (
                                <PositiveAndNegativeV2BarLabel
                                  {...props}
                                  value={innerValue}
                                  formatter={labelFormatter}
                                />
                              )
                            : false
                        }
                        fill={entry.innerBar?.[index]?.colorPositive}
                      >
                        {entry.innerBar?.map((innerEntry, innerIndex) => {
                          return (
                            <Cell
                              key={`inner-cell-${innerIndex}`}
                              fill={innerEntry.colorPositive}
                            />
                          );
                        })}
                      </Bar>
                    );
                  })}
                  <Bar
                    radius={[0, 4, 4, 0]}
                    dataKey="positiveValue"
                    label={(props) => {
                      // Use the actual positiveValue instead of the stacked total
                      const actualValue = visibleData[props.index]?.positiveValue || 0;
                      return (
                        <PositiveAndNegativeV2BarLabel
                          {...props}
                          value={actualValue}
                          formatter={labelFormatter}
                        />
                      );
                    }}
                    onClick={(props) => {
                      const item = props.payload;
                      if (item.isOthers) {
                        handleToggleShowAll();
                      } else if (callback) {
                        callback(item);
                      }
                    }}
                    className="transition-all duration-300 cursor-pointer"
                    stackId="a"
                  >
                    {visibleData.map((entry, index) => (
                      <Cell key={`positive-cell-${index}`} fill={entry.colorPositive} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </>
        )}
      </div>
      {!isMobile && <ChartLegend items={legendItems} />}
    </div>
  );
};

export default PositiveAndNegativeBarChartV2;
