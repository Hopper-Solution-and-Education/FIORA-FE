import _ from 'lodash';
import { BudgetAllocation } from '../types/budget.types';
import { Currency } from '@prisma/client';
import { convertCurrency } from './convertCurrency';

export function getMonthlyValues(fields: Record<string, any>, type: 'exp' | 'inc'): any[] {
  return Array.from({ length: 12 }, (_, i) => fields[`m${i + 1}_${type}`] ?? 0);
}

export function updateMonthlyValues(
  monthlyValues: number[],
  updates: Record<string, number>,
  type: 'exp' | 'inc',
): number[] {
  const updatedValues = [...monthlyValues];
  const monthMapping: Record<string, number> = {};
  for (let i = 1; i <= 12; i++) {
    monthMapping[`m${i}_${type}`] = monthlyValues[i - 1];
  }

  for (const [key, value] of Object.entries(updates)) {
    if (key.startsWith('m') && key in monthMapping) {
      const monthIndex = parseInt(key.match(/\d+/)![0]) - 1;
      updatedValues[monthIndex] = value;
    }
  }

  return updatedValues;
}

export const MONTH_MAPPING = {
  months: Array.from({ length: 12 }, (_, i) => `m${i + 1}`),
  quarters: Array.from({ length: 4 }, (_, i) => ({
    key: `q${i + 1}`,
    months: [i * 3, i * 3 + 1, i * 3 + 2],
  })),
  halfYears: [
    { key: 'h1', months: [0, 1, 2, 3, 4, 5] },
    { key: 'h2', months: [6, 7, 8, 9, 10, 11] },
  ],
};

export function applyUpdates(
  monthlyValues: number[],
  updates: Record<string, number>,
  type: 'exp' | 'inc',
  affectedFields: Map<string, boolean>,
  targetCurrency: Currency,
  storedCurrency: Currency,
): number[] {
  const result = [...monthlyValues];

  for (const [key, value] of Object.entries(updates)) {
    if (key.startsWith('m')) {
      const monthIndex = parseInt(key.match(/\d+/)![0]) - 1;

      // Ensure value is a number before conversion
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      const convertedValue = convertCurrency(numericValue, targetCurrency, storedCurrency);

      result[monthIndex] = convertedValue;
      affectedFields.set(key, true);

      const quarter = Math.floor(monthIndex / 3) + 1;
      const half = monthIndex < 6 ? 1 : 2;
      affectedFields.set(`q${quarter}_${type}`, true);
      affectedFields.set(`h${half}_${type}`, true);
    }
  }

  affectedFields.set(`total_${type}`, true);

  return result;
}

export function calculateBudgetAllocation(
  totalExpense: number,
  totalIncome: number,
): BudgetAllocation {
  // Create budget details for each month
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Quarterly fields
  const quarters = {
    q1: [1, 2, 3],
    q2: [4, 5, 6],
    q3: [7, 8, 9],
    q4: [10, 11, 12],
  };

  const monthlyExpense = _.round(totalExpense / 12, 2); // calculate with 2 decimal places
  const monthlyIncome = _.round(totalIncome / 12, 2); // calculate with 2 decimal places

  // Monthly fields split into 12 months
  const monthFields = months.reduce<Record<string, number>>((acc, m) => {
    acc[`m${m}_exp`] = monthlyExpense;
    acc[`m${m}_inc`] = monthlyIncome;
    return acc;
  }, {});

  // Quarterly fields
  const quarterFields = Object.entries(quarters).reduce<Record<string, number>>((acc, [q, ms]) => {
    acc[`${q}_exp`] = _.round(ms.length * monthlyExpense, 2); // by multiplying by 3 months with monthlyExpense
    acc[`${q}_inc`] = _.round(ms.length * monthlyIncome, 2); // by multiplying by 3 months with monthlyIncome
    return acc;
  }, {});

  // Half-year totals
  const h1_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
  const h2_exp = _.round(monthlyExpense * 6, 2); // 6 months in half-year
  const h1_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year
  const h2_inc = _.round(monthlyIncome * 6, 2); // 6 months in half-year

  return {
    monthFields,
    quarterFields,
    halfYearFields: { h1_exp, h2_exp, h1_inc, h2_inc },
    monthlyExpense,
    monthlyIncome,
  };
}
