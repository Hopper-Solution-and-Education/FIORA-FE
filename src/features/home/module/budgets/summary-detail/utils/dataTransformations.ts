import { DataSourceItemProps } from '@/components/common/tables/custom-table/types';
import { BudgetDetailFilterEnum } from '../data/constants';
import { MonthlyPlanningData } from '../data/dto/request/BudgetUpdateRequestDTO';
import { BudgetDetailFilterType, MONTHS, TableData } from '../presentation/types/table.type';

export const transformMonthlyDataToTableFormat = (data: MonthlyPlanningData) => {
  const result: { [key: string]: DataSourceItemProps } = {};
  const monthlyTotals: DataSourceItemProps[] = new Array(12).fill(0);
  let fullYear: DataSourceItemProps = { value: 0 };

  Object.entries(data).forEach(([key, value]) => {
    const numValue = typeof value === 'number' ? value : 0;
    const match = key.match(/(m|q|h)(\d+)_|total_/);

    if (match) {
      if (match[0].startsWith('total_')) {
        result['fullYear'] = {
          value: numValue,
        };
        fullYear = {
          value: numValue,
        };
      } else {
        const type = match[1];
        const number = parseInt(match[2], 10) - 1;

        switch (type) {
          case 'm':
            if (number >= 0 && number < 12) {
              result[MONTHS[number]] = {
                value: numValue,
              };
              monthlyTotals[number] = {
                value: numValue,
              };
            }
            break;
          case 'q':
            if (number >= 0 && number < 4) {
              result[`q${number + 1}`] = {
                value: numValue,
              };
            }
            break;
          case 'h':
            if (number >= 0 && number < 2) {
              result[`h${number + 1}`] = {
                value: numValue,
              };
            }
            break;
        }
      }
    }
  });

  result['q1'] = {
    value: monthlyTotals.slice(0, 3).reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };
  result['q2'] = {
    value: monthlyTotals.slice(3, 6).reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };
  result['q3'] = {
    value: monthlyTotals.slice(6, 9).reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };
  result['q4'] = {
    value: monthlyTotals
      .slice(9, 12)
      .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };
  result['h1'] = {
    value: monthlyTotals.slice(0, 6).reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };
  result['h2'] = {
    value: monthlyTotals
      .slice(6, 12)
      .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };
  result['fullYear'] = fullYear || {
    value: monthlyTotals.reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
  };

  return result;
};

export const transformMonthlyData = (
  data: TableData,
  activeTab: BudgetDetailFilterType,
): MonthlyPlanningData => {
  const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
  const result: MonthlyPlanningData = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [`m${i + 1}${suffix}`, { value: 0 }]),
  );

  Object.entries(data).forEach(([key, value]) => {
    const monthIndex = MONTHS.indexOf(key as (typeof MONTHS)[number]);
    if (monthIndex !== -1) {
      const numericValue = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
      if (!isNaN(Number(numericValue))) {
        result[`m${monthIndex + 1}${suffix}`] = { value: Number(numericValue) };
      }
    }
  });

  return result;
};

export const transformMonthlyPayload = (
  data: TableData,
  activeTab: BudgetDetailFilterType,
): MonthlyPlanningData => {
  const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
  const result: MonthlyPlanningData = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [`m${i + 1}${suffix}`, 0]),
  );

  Object.entries(data).forEach(([key, value]) => {
    const monthIndex = MONTHS.indexOf(key as (typeof MONTHS)[number]);
    if (monthIndex !== -1) {
      let numericValue: any;
      if (value && typeof value === 'object' && 'value' in value) {
        numericValue = Number(value.value);
      } else {
        numericValue = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
      }
      if (!isNaN(numericValue)) {
        result[`m${monthIndex + 1}${suffix}`] = numericValue;
      }
    }
  });

  return result;
};

/**
 * Creates monthly data object dynamically
 * @param response - Response object containing monthly data
 * @param suffix - Suffix for the month keys (_exp or _inc)
 * @param months - Number of months (default: 12)
 */
export const createMonthlyData = (
  response: any,
  suffix: string,
  months: number = 12,
): MonthlyPlanningData => {
  return Array.from({ length: months }, (_, i) => i + 1).reduce(
    (acc, month) => ({
      ...acc,
      [`m${month}${suffix}`]: response[`m${month}${suffix}`] || 0,
    }),
    {} as MonthlyPlanningData,
  );
};
