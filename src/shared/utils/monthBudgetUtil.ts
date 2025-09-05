import { BudgetsTable, Category, CategoryType, Transaction, TransactionType } from '@prisma/client';
import _ from 'lodash';
import { BudgetAllocation, FetchTransactionResponse, SumUpAllocation } from '../types/budget.types';
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

export async function applyUpdates(
  monthlyValues: number[],
  updates: Record<string, number>,
  type: 'exp' | 'inc',
  affectedFields: Map<string, boolean>,
  targetCurrency: string,
  storedCurrency: string,
): Promise<number[]> {
  const result = [...monthlyValues];

  for (const [key, value] of Object.entries(updates)) {
    if (key.startsWith('m')) {
      const monthIndex = parseInt(key.match(/\d+/)![0]) - 1;

      // Ensure value is a number before conversion
      const numericValue = typeof value === 'string' ? parseFloat(value) : value;
      const convertedValue = await convertCurrency(numericValue, targetCurrency, storedCurrency);

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

export async function calculateSumUpAllocationByType(
  transactions: Transaction[],
  year: number,
  foundCategory: Category,
  currency: string,
): Promise<SumUpAllocation> {
  const { type } = foundCategory;

  const suffix = type === CategoryType.Expense ? 'exp' : 'inc';

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const quarters = {
    q1: [1, 2, 3],
    q2: [4, 5, 6],
    q3: [7, 8, 9],
    q4: [10, 11, 12],
  };

  const monthFields: Record<string, number> = {};

  // Process all transactions in parallel
  await Promise.all(
    months.map(async (month) => {
      // Filter transactions for this month and year
      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });

      // Convert all amounts in parallel
      const convertedAmounts = await Promise.all(
        monthTransactions.map((t) => convertCurrency(t.amount.toNumber(), t.currency!, currency)),
      );

      // Sum up the converted amounts
      const total = convertedAmounts.reduce((sum, amount) => sum + amount, 0);

      monthFields[`m${month}_${suffix}`] = Number(total.toFixed(2));
    }),
  );

  const quarterFields: Record<string, number> = {};
  Object.entries(quarters).forEach(([q, ms]) => {
    const quarterTotalExp = ms.reduce((sum, m) => sum + (monthFields[`m${m}_${suffix}`] || 0), 0);
    quarterFields[`${q}_${suffix}`] = Number(quarterTotalExp.toFixed(2));
  });

  const half_year_first = Number(
    [1, 2, 3, 4, 5, 6]
      .reduce((sum, m) => sum + (monthFields[`m${m}_${suffix}`] || 0), 0)
      .toFixed(2),
  );
  const half_year_second = Number(
    [7, 8, 9, 10, 11, 12]
      .reduce((sum, m) => sum + (monthFields[`m${m}_${suffix}`] || 0), 0)
      .toFixed(2),
  );

  return {
    monthFields: monthFields,
    quarterFields: quarterFields,
    halfYearFields: {
      [`h1_${suffix}`]: half_year_first,
      [`h2_${suffix}`]: half_year_second,
    },
  };
}

export async function calculateSumUpAllocation(
  transactions: FetchTransactionResponse[],
  currency: string,
  budget?: BudgetsTable,
): Promise<SumUpAllocation> {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const quarters = {
    q1: [1, 2, 3],
    q2: [4, 5, 6],
    q3: [7, 8, 9],
    q4: [10, 11, 12],
  };

  const monthFields: Record<string, number> = {};

  // Refactored to process months sequentially and handle async/await properly
  for (const month of months) {
    const monthTransactions = transactions.filter((t) => {
      const transactionMonth = new Date(t.date).getMonth() + 1; // 0-based to 1-based
      return transactionMonth === month;
    });

    if (monthTransactions.length > 0) {
      // Group transactions by type for this month
      const groupedByType: { [key: string]: typeof monthTransactions } = {
        exp: [],
        inc: [],
      };
      monthTransactions.forEach((t) => {
        const suffix = t.type === TransactionType.Expense ? 'exp' : 'inc';
        groupedByType[suffix].push(t);
      });

      for (const suffix of ['exp', 'inc'] as const) {
        const monthKey = `m${month}_${suffix}`;
        const relevantTransactions = groupedByType[suffix];

        if (relevantTransactions.length > 0) {
          // Sum all converted amounts for this type in this month
          const amounts = await Promise.all(
            relevantTransactions.map((t) =>
              convertCurrency(t.amount.toNumber(), t.currency!, currency),
            ),
          );
          const totalAmount = amounts.reduce((sum, val) => sum + val, 0);

          if (budget && budget.currency) {
            const accumulatedAmount = budget[monthKey as keyof BudgetsTable] || 0;
            const convertedAccumulated = await convertCurrency(
              Number(accumulatedAmount),
              budget.currency!,
              currency,
            );
            monthFields[monthKey] = Number(convertedAccumulated) + totalAmount;
          } else {
            monthFields[monthKey] = totalAmount || 0;
          }
        }
      }
    }

    // If there are no transactions in the month, then set the amount to 0 or use budget if available
    if (budget) {
      const monthKeyInc = `m${month}_inc`;
      const monthKeyExp = `m${month}_exp`;

      monthFields[monthKeyInc] = Number(budget[monthKeyInc as keyof BudgetsTable] || 0);
      monthFields[monthKeyExp] = Number(budget[monthKeyExp as keyof BudgetsTable] || 0);
    }
  }

  const quarterFields: Record<string, number> = {};

  Object.entries(quarters).forEach(([q, ms]) => {
    const quarterTotalExp = ms.reduce((sum, m) => sum + (monthFields[`m${m}_exp`] || 0), 0);
    const quarterTotalInc = ms.reduce((sum, m) => sum + (monthFields[`m${m}_inc`] || 0), 0);

    quarterFields[`${q}_exp`] = Number(quarterTotalExp.toFixed(2));
    quarterFields[`${q}_inc`] = Number(quarterTotalInc.toFixed(2));
  });

  const h1_exp = Number(
    [1, 2, 3, 4, 5, 6].reduce((sum, m) => sum + (monthFields[`m${m}_exp`] || 0), 0).toFixed(2),
  );
  const h2_exp = Number(
    [7, 8, 9, 10, 11, 12].reduce((sum, m) => sum + (monthFields[`m${m}_exp`] || 0), 0).toFixed(2),
  );
  const h1_inc = Number(
    [1, 2, 3, 4, 5, 6].reduce((sum, m) => sum + (monthFields[`m${m}_inc`] || 0), 0).toFixed(2),
  );
  const h2_inc = Number(
    [7, 8, 9, 10, 11, 12].reduce((sum, m) => sum + (monthFields[`m${m}_inc`] || 0), 0).toFixed(2),
  );

  return {
    monthFields: monthFields,
    quarterFields: quarterFields,
    halfYearFields: { h1_exp, h2_exp, h1_inc, h2_inc },
  };
}

export function calculateTransactionRange(fiscalYear: number): {
  yearStart: Date;
  effectiveEndDate: Date;
} {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const yearStart = new Date(`${fiscalYear}-01-01`);
  let targetMonthEnd: Date;

  if (fiscalYear === currentYear) {
    const targetMonth = currentMonth - 2;
    targetMonthEnd = targetMonth < 1 ? yearStart : new Date(fiscalYear, targetMonth, 0);
  } else {
    targetMonthEnd = new Date(`${fiscalYear}-12-31`);
  }

  const effectiveEndDate = targetMonthEnd < thirtyDaysAgo ? targetMonthEnd : thirtyDaysAgo;
  return { yearStart, effectiveEndDate };
}
