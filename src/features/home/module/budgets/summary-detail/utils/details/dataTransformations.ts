/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSourceItemProps } from '@/components/common/tables/custom-table/types';
import { BudgetDetailFilterEnum } from '../../data/constants';
import { MonthlyPlanningData } from '../../data/dto/request/BudgetUpdateRequestDTO';
import {
  BudgetDetailFilterType,
  MONTHS,
  TableData,
  TableRowData,
} from '../../presentation/types/table.type';

export const transformMonthlyDataToTableFormat = (data: MonthlyPlanningData) => {
  const result: TableRowData = {};
  const monthlyTotals: DataSourceItemProps[] = new Array(12).fill(0);
  let fullYear: DataSourceItemProps = { value: 0 };

  // Map API keys with _exp/_inc to table keys
  Object.entries(data).forEach(([key, value]) => {
    const numValue = Number(value) || 0;
    // Map q1_exp/q1_inc -> q1, h1_exp/h1_inc -> h1, total_exp/total_inc -> fullYear
    if (key === 'q1_exp' || key === 'q1_inc') result['q1'] = { value: numValue };
    if (key === 'q2_exp' || key === 'q2_inc') result['q2'] = { value: numValue };
    if (key === 'q3_exp' || key === 'q3_inc') result['q3'] = { value: numValue };
    if (key === 'q4_exp' || key === 'q4_inc') result['q4'] = { value: numValue };
    if (key === 'h1_exp' || key === 'h1_inc') result['h1'] = { value: numValue };
    if (key === 'h2_exp' || key === 'h2_inc') result['h2'] = { value: numValue };
    if (key === 'total_exp' || key === 'total_inc') {
      result['fullYear'] = { value: numValue };
      fullYear = { value: numValue };
    }
  });

  Object.entries(data).forEach(([key, value]) => {
    const numValue = Number(value) || 0;
    const match = key.match(/(m|q|h)(\d+)_|total_/);

    if (match) {
      if (match[0].startsWith('total_')) {
        // Đã xử lý ở trên
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
        }
      }
    }
  });

  // Nếu chưa có các trường tổng hợp, tự tính lại
  if (!result['q1']) {
    result['q1'] = {
      value: monthlyTotals
        .slice(0, 3)
        .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }
  if (!result['q2']) {
    result['q2'] = {
      value: monthlyTotals
        .slice(3, 6)
        .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }
  if (!result['q3']) {
    result['q3'] = {
      value: monthlyTotals
        .slice(6, 9)
        .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }
  if (!result['q4']) {
    result['q4'] = {
      value: monthlyTotals
        .slice(9, 12)
        .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }
  if (!result['h1']) {
    result['h1'] = {
      value: monthlyTotals
        .slice(0, 6)
        .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }
  if (!result['h2']) {
    result['h2'] = {
      value: monthlyTotals
        .slice(6, 12)
        .reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }
  if (!result['fullYear']) {
    result['fullYear'] = {
      value: monthlyTotals.reduce((sum, val) => Number(sum) + Number(val?.value || 0), 0),
    };
  }

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
