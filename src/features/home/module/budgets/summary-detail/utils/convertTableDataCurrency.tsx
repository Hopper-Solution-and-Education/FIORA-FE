import { DataSourceItemProps } from '@/components/common/tables/custom-table/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { USD_VND_RATE } from '@/shared/constants';
import { formatters } from '@/shared/lib';
import { Currency } from '@/shared/types';
import { convertVNDToUSD } from '@/shared/utils';
import { isArray } from 'lodash';
import { TableData } from '../presentation/types/table.type';

export const formatCurrencyValue = (
  value: number | string | undefined,
  currency: Currency,
): string => {
  if (value === undefined || value === '') return '';

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return formatters[currency].format(numValue);
};

export const convertTableDataCurrency = (
  tableData: TableData[],
  userCurrency: Currency,
): TableData[] => {
  const renderRemaining = (
    bottomUpValue: number,
    actualSumUpValue: number,
    userCurrency: Currency,
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="cursor-pointer px-3 py-2">
            {formatCurrencyValue(bottomUpValue - actualSumUpValue, userCurrency)}
          </p>
        </TooltipTrigger>
        <TooltipContent className="whitespace-pre-line bg-white text-black dark:bg-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
          <div>
            <span>
              Remaining = Bottom Up - Actual Sum Up
              {'\n'}
              {formatCurrencyValue(bottomUpValue - actualSumUpValue, userCurrency)} ={' '}
              {formatCurrencyValue(bottomUpValue, userCurrency)} -{' '}
              {formatCurrencyValue(actualSumUpValue, userCurrency)}
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const transformItem = (item: TableData, baseCurrency: Currency): TableData => {
    const transformedItem: TableData = { ...item };

    const periodFields = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
      'q1',
      'q2',
      'q3',
      'q4',
      'h1',
      'h2',
      'fullYear',
    ];

    periodFields.forEach((field) => {
      if (
        transformedItem[field] &&
        typeof transformedItem[field] === 'object' &&
        'value' in transformedItem[field]
      ) {
        const dataItem = transformedItem[field] as DataSourceItemProps;
        let originalValue = Number(dataItem.value) || 0;

        // Convert currency if needed
        if (baseCurrency !== userCurrency) {
          if (baseCurrency === 'VND' && userCurrency === 'USD') {
            originalValue = convertVNDToUSD(originalValue);
          } else if (baseCurrency === 'USD' && userCurrency === 'VND') {
            originalValue = originalValue * USD_VND_RATE;
          }
        }

        transformedItem[field] = {
          ...dataItem,
          value: originalValue,
        };
      } else if (!transformedItem[field]) {
        // Handle calculated remaining value based on bottom up and actual sum up
        if (transformedItem?.categoryId && isArray(transformedItem.children)) {
          // Find Bottom Up Item
          const bottomUp = transformedItem.children.find((child) =>
            child.type.includes('Bottom Up'),
          );
          // Find Actual Sum Up Item
          const actualSumUp = transformedItem.children.find((child) =>
            child.type.includes('Actual Sum Up'),
          );
          // If Bottom Up or Actual Sum Up Item has value, calculate the remaining value
          if (
            (bottomUp?.[field] &&
              typeof bottomUp[field] === 'object' &&
              'value' in bottomUp[field]) ||
            (actualSumUp?.[field] &&
              typeof actualSumUp[field] === 'object' &&
              'value' in actualSumUp[field])
          ) {
            // Get value of Bottom Up
            let bottomUpValue =
              bottomUp &&
              bottomUp[field] &&
              typeof bottomUp[field] === 'object' &&
              'value' in bottomUp[field]
                ? Number((bottomUp[field] as DataSourceItemProps).value)
                : 0;

            // Get value of Actual Sum Up
            let actualSumUpValue =
              actualSumUp &&
              actualSumUp[field] &&
              typeof actualSumUp[field] === 'object' &&
              'value' in actualSumUp[field]
                ? Number((actualSumUp[field] as DataSourceItemProps).value)
                : 0;

            // Convert currency if needed
            if (baseCurrency !== userCurrency) {
              if (baseCurrency === 'VND' && userCurrency === 'USD') {
                bottomUpValue = convertVNDToUSD(bottomUpValue);
                actualSumUpValue = convertVNDToUSD(actualSumUpValue);
              } else if (baseCurrency === 'USD' && userCurrency === 'VND') {
                bottomUpValue = bottomUpValue * USD_VND_RATE;
                actualSumUpValue = actualSumUpValue * USD_VND_RATE;
              }
            }

            // Calculate the remaing value
            transformedItem[field] = {
              value: bottomUpValue - actualSumUpValue,
              render: renderRemaining(bottomUpValue, actualSumUpValue, userCurrency),
            };
          } else {
            // If both Bottom Up and Actual Sum Up has no value, set remaining value to 0
            transformedItem[field] = { value: 0 };
          }
        }
      }
    });

    if (transformedItem.children) {
      transformedItem.children = transformedItem.children.map((child) =>
        transformItem(child, baseCurrency),
      );
    }

    return transformedItem;
  };

  // Lấy baseCurrency từ dòng top-down
  const topDownItem = tableData.find((item) => item.key === 'top-down');
  const baseCurrency = (topDownItem?.currency || 'USD') as Currency;

  return tableData.map((item) => transformItem(item, baseCurrency));
};
