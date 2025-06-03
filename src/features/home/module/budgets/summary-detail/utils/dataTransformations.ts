import { BudgetDetailFilterEnum } from '../data/constants';
import { MonthlyPlanningData } from '../data/dto/request/BudgetUpdateRequestDTO';
import { BudgetDetailFilterType, MONTHS, TableData } from '../presentation/types/table.type';

export const transformMonthlyDataToTableFormat = (data: MonthlyPlanningData) => {
  const result: { [key: string]: number } = {};
  const monthlyTotals: number[] = new Array(12).fill(0);
  let fullYear = 0;

  Object.entries(data).forEach(([key, value]) => {
    const numValue = typeof value === 'number' ? value : 0;
    const match = key.match(/(m|q|h)(\d+)_|total_/);

    if (match) {
      if (match[0].startsWith('total_')) {
        result['fullYear'] = numValue;
        fullYear = numValue;
      } else {
        const type = match[1];
        const number = parseInt(match[2], 10) - 1;

        switch (type) {
          case 'm':
            if (number >= 0 && number < 12) {
              result[MONTHS[number]] = numValue;
              monthlyTotals[number] = numValue;
            }
            break;
          case 'q':
            if (number >= 0 && number < 4) {
              result[`q${number + 1}`] = numValue;
            }
            break;
          case 'h':
            if (number >= 0 && number < 2) {
              result[`h${number + 1}`] = numValue;
            }
            break;
        }
      }
    }
  });

  result['q1'] = monthlyTotals.slice(0, 3).reduce((sum, val) => sum + val, 0);
  result['q2'] = monthlyTotals.slice(3, 6).reduce((sum, val) => sum + val, 0);
  result['q3'] = monthlyTotals.slice(6, 9).reduce((sum, val) => sum + val, 0);
  result['q4'] = monthlyTotals.slice(9, 12).reduce((sum, val) => sum + val, 0);
  result['h1'] = monthlyTotals.slice(0, 6).reduce((sum, val) => sum + val, 0);
  result['h2'] = monthlyTotals.slice(6, 12).reduce((sum, val) => sum + val, 0);
  result['fullYear'] = fullYear || monthlyTotals.reduce((sum, val) => sum + val, 0);

  return result;
};

export const transformMonthlyData = (
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
      const numericValue = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
      if (!isNaN(numericValue)) {
        result[`m${monthIndex + 1}${suffix}`] = numericValue;
      }
    }
  });

  return result;
};
