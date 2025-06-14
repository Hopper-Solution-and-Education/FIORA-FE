import { Currency } from '@/shared/types';
import { TableData } from '../presentation/types/table.type';
import { DataSourceItemProps } from '@/components/common/tables/custom-table/types';
import { formatters } from '@/shared/lib';
import { convertVNDToUSD } from '@/shared/utils';

const EXCHANGE_RATE = 23000; // 1 USD = 23,000 VND

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
            originalValue = originalValue * EXCHANGE_RATE;
          }
        }

        transformedItem[field] = {
          ...dataItem,
          value: originalValue,
        };
      } else if (!transformedItem[field]) {
        transformedItem[field] = { value: 0 };
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
