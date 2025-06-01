import { MonthlyPlanningData } from '../data/dto/request/BudgetUpdateRequestDTO';

export const transformMonthlyDataToTableFormat = (data: MonthlyPlanningData) => {
  const monthMap = {
    m1: 'jan',
    m2: 'feb',
    m3: 'mar',
    m4: 'apr',
    m5: 'may',
    m6: 'jun',
    m7: 'jul',
    m8: 'aug',
    m9: 'sep',
    m10: 'oct',
    m11: 'nov',
    m12: 'dec',
  };

  const quarterMap = { q1: 'q1', q2: 'q2', q3: 'q3', q4: 'q4' };
  const halfYearMap = { h1: 'h1', h2: 'h2' };

  const result: { [key: string]: number } = {};

  Object.entries(data).forEach(([key, value]) => {
    const monthNumber = key.match(/m(\d+)_/)?.[1];
    if (monthNumber) {
      const monthKey = monthMap[`m${monthNumber}` as keyof typeof monthMap];
      if (monthKey) result[monthKey] = value;
    }

    const quarterNumber = key.match(/q(\d+)_/)?.[1];
    if (quarterNumber) {
      const quarterKey = quarterMap[`q${quarterNumber}` as keyof typeof quarterMap];
      if (quarterKey) result[quarterKey] = value;
    }

    const halfYearNumber = key.match(/h(\d+)_/)?.[1];
    if (halfYearNumber) {
      const halfYearKey = halfYearMap[`h${halfYearNumber}` as keyof typeof halfYearMap];
      if (halfYearKey) result[halfYearKey] = value;
    }

    if (key.startsWith('total_')) {
      result['fullYear'] = value;
    }
  });

  return result;
};
