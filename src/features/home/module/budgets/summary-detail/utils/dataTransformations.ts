import { BudgetDetailFilterEnum } from '../data/constants';
import { MonthlyPlanningData } from '../data/dto/request/BudgetUpdateRequestDTO';
import { BudgetDetailFilterType, MONTHS, TableData } from '../presentation/types/table.type';

export const transformMonthlyDataToTableFormat = (data: MonthlyPlanningData) => {
  const result: { [key: string]: number } = {};

  Object.entries(data).forEach(([key, value]) => {
    const match = key.match(/(m|q|h)(\d+)_|total_/);
    if (match) {
      if (match[0].startsWith('total_')) {
        result['fullYear'] = value;
      } else {
        const type = match[1];
        const number = parseInt(match[2], 10);

        if (type === 'm' && number >= 1 && number <= 12) {
          result[MONTHS[number - 1]] = value;
        } else if (type === 'q' && number >= 1 && number <= 4) {
          result[`q${number}`] = value;
        } else if (type === 'h' && number >= 1 && number <= 2) {
          result[`h${number}`] = value;
        }
      }
    }
  });

  return result;
};

export const transformMonthlyData = (
  data: TableData,
  activeTab: BudgetDetailFilterType,
): MonthlyPlanningData => {
  const suffix = activeTab === BudgetDetailFilterEnum.EXPENSE ? '_exp' : '_inc';
  const result: MonthlyPlanningData = {};
  for (let i = 1; i <= 12; i++) {
    result[`m${i}${suffix}`] = 0;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (MONTHS.includes(key as (typeof MONTHS)[number])) {
      // Ép kiểu key thành literal type
      const monthIndex = MONTHS.indexOf(key as (typeof MONTHS)[number]);
      if (monthIndex !== -1) {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!isNaN(numericValue)) {
          result[`m${monthIndex + 1}${suffix}`] = numericValue;
        }
      }
    }
  });

  return result;
};
