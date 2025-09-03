'use client';

import { ChartLegend, IconDisplay, PositiveAndNegativeV2BarLabel } from '@/components/common/atoms';
import StackYAxisTick from '@/components/common/atoms/StackYAxisTick';
import { Icons } from '@/components/Icon';
import { COLORS, DEFAULT_BUDGET_ICON, DEFAULT_CURRENCY, STACK_KEY } from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { cn } from '@/shared/utils';
import { useWindowSize } from '@/shared/utils/device';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StackBarDisplay, TooltipProps } from '../stacked-bar-chart/type';
import { PositiveNegativeStackBarChartProps } from './type';
import { processChartData } from './utils';

const PositiveNegativeStackBarChart = (props: PositiveNegativeStackBarChartProps) => {
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const { formatCurrency } = useCurrencyFormatter();
  const {
    data = [],
    title,
    icon = DEFAULT_BUDGET_ICON,
    currency = DEFAULT_CURRENCY,
    callback,
    className,
    xAxisFormatter = (value) => formatCurrency(value, currency),
    tutorialText,
    legendItems,
    onClickTitle,
  } = props;

  // Process chart data using utility function
  const {
    hasNegativeValues,
    positiveData,
    negativeData,
    minNegative,
    maxPositive,
    chartHeight,
    negativeChartMargins,
    positiveChartMargins,
    calculateRValue,
  } = processChartData(data, width, isMobile);

  const renderTooltipContent = (props: TooltipProps) => {
    let remaining = 0;
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const renderKeyText = (key: string | number | undefined) => {
      if (!key) return '';
      if (key === STACK_KEY.A) return 'Actual Transaction';
      if (key === STACK_KEY.T) return 'Top Down';
      if (key === STACK_KEY.B) return 'Bottom Up';
      return key.toString();
    };

    // Remaining:
    // Type: Expense = Bottom Up - Actual
    // Type: Profit = Actual - Bottom Up
    // Type: Income = Actual - Bottom Up
    switch (label) {
      case 'Expense':
        remaining =
          payload[0].payload[`${STACK_KEY.B}OriginalValue`] -
          payload[0].payload[`${STACK_KEY.A}OriginalValue`];
        break;
      case 'Profit':
        remaining =
          payload[0].payload[`${STACK_KEY.A}OriginalValue`] -
          payload[0].payload[`${STACK_KEY.B}OriginalValue`];
        break;
      case 'Income':
        remaining =
          payload[0].payload[`${STACK_KEY.A}OriginalValue`] -
          payload[0].payload[`${STACK_KEY.B}OriginalValue`];
        break;
    }

    return (
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1"
          >
            <div
              className="w-3 h-3 mr-2 rounded-sm"
              style={{ backgroundColor: item.payload.colors[item.dataKey as string] }}
            />
            <span>{renderKeyText(item.dataKey)}:</span>
            <span className="font-bold ml-1">
              {formatCurrency(item.payload[`${item.dataKey}OriginalValue`], currency)}
            </span>
          </div>
        ))}

        <div className="flex items-center gap-2 text-xs mt-3 px-2 py-1 rounded bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border border-blue-200 dark:border-blue-700 shadow-inner">
          <span className="inline-flex items-center font-semibold text-blue-700 dark:text-blue-300">
            <Icons.cornerDownRight className="w-4 h-4 mr-1" />
            Remaining = Bottom Up - Actual Sum Up =
          </span>
          <span className="font-bold text-blue-800 dark:text-blue-200">
            {formatCurrency(remaining, currency)}
          </span>
        </div>
        {tutorialText && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{tutorialText}</p>
        )}
      </div>
    );
  };

  const renderCustomLabel = (data: StackBarDisplay[], props: any, dataKey: string) => {
    const { x, y, width, height, index } = props;
    const entry = data[index];

    if (dataKey !== entry.maxKey) return null;

    const R = calculateRValue(entry);

    const labelX = x + width + 10;
    const labelY = y + height / 2 - 5;

    return (
      <g className="hidden md:block">
        <text
          x={labelX}
          y={labelY - 5}
          fill="currentColor"
          className="text-gray-600 dark:text-gray-400"
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={600}
        >
          T: {formatCurrency(entry.TOriginalValue, currency)} → B:{' '}
          {formatCurrency(entry.BOriginalValue, currency)}
        </text>
        <text
          x={labelX}
          y={labelY + 15}
          fill={R >= 0 ? COLORS.DEPS_INFO.LEVEL_1 : COLORS.DEPS_DANGER.LEVEL_1}
          className={R >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={600}
        >
          R: {R > 0 && '+'}
          {formatCurrency(R, currency)}
        </text>
      </g>
    );
  };

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200',
        className,
      )}
    >
      {title && (
        <div className="flex justify-start items-center gap-4 mb-4 ml-2">
          <IconDisplay icon={icon} className="w-12 h-12" onClick={onClickTitle} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        </div>
      )}
      {hasNegativeValues ? (
        <>
          <div className="flex">
            {/* Negative Chart */}
            <ResponsiveContainer width="40%" height={chartHeight}>
              <BarChart data={negativeData} layout="vertical" margin={negativeChartMargins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  domain={[minNegative, 0]}
                  tickFormatter={xAxisFormatter}
                  className="text-sm text-gray-600"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  hide={false}
                  tickLine={false}
                  axisLine={false}
                  tick={(props) => (
                    <StackYAxisTick {...props} processedData={data} callback={callback} />
                  )}
                  className="text-sm text-gray-600"
                />
                <Tooltip content={renderTooltipContent} />
                {[STACK_KEY.A, STACK_KEY.B, STACK_KEY.T].map((key) => (
                  <Bar
                    radius={[0, 0, 0, 0]}
                    key={key}
                    dataKey={key}
                    stackId="a"
                    activeBar={{
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                      cursor: 'pointer',
                    }}
                    label={(props: any) => {
                      const entry = positiveData[props.index];
                      let displayValue = 0;
                      if (key === STACK_KEY.A) {
                        // Actual Transaction
                        displayValue = entry.AOriginalValue;
                      } else if (key === STACK_KEY.B) {
                        // Bottom Up
                        displayValue = entry.BOriginalValue;
                      } else if (key === STACK_KEY.T) {
                        // Top Down
                        displayValue = entry.TOriginalValue;
                      }
                      return (
                        <PositiveAndNegativeV2BarLabel
                          {...props}
                          entry={entry}
                          renderValue={formatCurrency(displayValue, currency)}
                        />
                      );
                    }}
                    onClick={(props) => callback && callback(props.payload)}
                    className="transition-all duration-300 cursor-pointer"
                  >
                    {negativeData.map((entry, index) => (
                      <Cell key={index} fill={entry.colors[key as keyof typeof entry.colors]} />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
            {/* Positive Chart */}
            <ResponsiveContainer width="60%" height={chartHeight}>
              <BarChart data={positiveData} layout="vertical" margin={positiveChartMargins}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  domain={[0, maxPositive]}
                  tickFormatter={xAxisFormatter}
                  className="text-sm text-gray-600"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  hide={true}
                  tickLine={false}
                  axisLine={false}
                  tick={(props) => (
                    <StackYAxisTick {...props} processedData={data} callback={callback} />
                  )}
                  className="text-sm text-gray-600"
                />
                <Tooltip content={renderTooltipContent} />
                {[STACK_KEY.A, STACK_KEY.B, STACK_KEY.T].map((key) => (
                  <Bar
                    radius={[0, 0, 0, 0]}
                    key={key}
                    dataKey={key}
                    stackId="a"
                    activeBar={{
                      stroke: '#ffffff',
                      strokeWidth: 2,
                      filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                      cursor: 'pointer',
                    }}
                    label={(props: any) => {
                      const entry = positiveData[props.index];
                      let displayValue = 0;
                      if (key === STACK_KEY.A) {
                        // Actual Transaction
                        displayValue = entry.AOriginalValue;
                      } else if (key === STACK_KEY.B) {
                        // Bottom Up
                        displayValue = entry.BOriginalValue;
                      } else if (key === STACK_KEY.T) {
                        // Top Down
                        displayValue = entry.TOriginalValue;
                      }
                      return (
                        <PositiveAndNegativeV2BarLabel
                          {...props}
                          entry={entry}
                          renderValue={formatCurrency(displayValue, currency)}
                        />
                      );
                    }}
                    onClick={(props) => callback && callback(props.payload)}
                    className="transition-all duration-300 cursor-pointer"
                  >
                    {positiveData.map((entry, index) => (
                      <Cell key={index} fill={entry.colors[key as keyof typeof entry.colors]} />
                    ))}
                    <LabelList
                      dataKey={key}
                      content={(props) => renderCustomLabel(positiveData, props, key)}
                      position="right"
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={positiveData} layout="vertical" margin={positiveChartMargins}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              domain={[0, maxPositive]}
              tickFormatter={xAxisFormatter}
              className="text-sm text-gray-600"
            />
            <YAxis
              type="category"
              dataKey="name"
              hide={false}
              tickLine={false}
              axisLine={false}
              tick={(props) => (
                <StackYAxisTick {...props} processedData={data} callback={callback} />
              )}
              className="text-sm text-gray-600"
            />
            <Tooltip content={renderTooltipContent} />
            {[STACK_KEY.A, STACK_KEY.B, STACK_KEY.T].map((key: any) => (
              <Bar
                radius={[0, 0, 0, 0]}
                key={key}
                dataKey={key}
                stackId="a"
                activeBar={{
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                  cursor: 'pointer',
                }}
                label={(props: any) => {
                  const entry = positiveData[props.index];
                  let displayValue = 0;
                  if (key === STACK_KEY.A) {
                    // Actual Transaction
                    displayValue = entry.AOriginalValue;
                  } else if (key === STACK_KEY.B) {
                    // Bottom Up
                    displayValue = entry.BOriginalValue;
                  } else if (key === STACK_KEY.T) {
                    // Top Down
                    displayValue = entry.TOriginalValue;
                  }
                  return (
                    <PositiveAndNegativeV2BarLabel
                      {...props}
                      entry={entry}
                      renderValue={formatCurrency(displayValue, currency)}
                    />
                  );
                }}
                onClick={(props) => callback && callback(props.payload)}
                className="transition-all duration-300 cursor-pointer"
              >
                {positiveData.map((entry, index) => (
                  <Cell key={index} fill={entry.colors[key as keyof typeof entry.colors]} />
                ))}
                <LabelList
                  dataKey={key}
                  content={(props) => renderCustomLabel(positiveData, props, key)}
                  position="right"
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default PositiveNegativeStackBarChart;
