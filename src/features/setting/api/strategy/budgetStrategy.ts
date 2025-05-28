import { MONTH_MAPPING } from '@/shared/utils/monthBudgetUtil';
import { Prisma } from '@prisma/client';

interface BudgetUpdateStrategy {
  getFields(affectedFields: Set<string>): Record<string, boolean>;
  calculateTotals(monthlyValues: number[]): BudgetTotals;
  prepareUpdateData(
    totals: BudgetTotals,
    monthlyValues: number[],
    affectedFields: Map<string, boolean>,
  ): Prisma.BudgetsTableUpdateInput;
  getType(): string;
}

interface BudgetTotals {
  total: number;
  quarterTotals: number[];
  halfYearTotals: number[];
}

class ExpenseUpdateStrategy implements BudgetUpdateStrategy {
  getFields(affectedFields: Set<string>): Record<string, boolean> {
    const fields: Record<string, boolean> = { total_exp: true };

    MONTH_MAPPING.quarters.forEach((q) => {
      if (affectedFields.has(`${q.key}_exp`)) fields[`${q.key}_exp`] = true;
    });

    MONTH_MAPPING.halfYears.forEach((h) => {
      if (affectedFields.has(`${h.key}_exp`)) fields[`${h.key}_exp`] = true;
    });

    MONTH_MAPPING.months.forEach((m) => {
      if (affectedFields.has(`${m}_exp`)) fields[`${m}_exp`] = true;
    });

    return fields;
  }

  calculateTotals(monthlyValues: number[]): BudgetTotals {
    let total = 0;
    const quarterTotals = [0, 0, 0, 0];
    const halfYearTotals = [0, 0];

    monthlyValues.forEach((value, index) => {
      total += value; // Sum all monthly values
      const quarterIndex = Math.floor(index / 3);
      quarterTotals[quarterIndex] += value; // Sum for each quarter
      const halfYearIndex = index < 6 ? 0 : 1;
      halfYearTotals[halfYearIndex] += value; // Sum for each half-year
    });

    return { total, quarterTotals, halfYearTotals };
  }

  prepareUpdateData(
    totals: BudgetTotals,
    monthlyValues: number[],
    affectedFields: Map<string, boolean>,
  ): Prisma.BudgetsTableUpdateInput {
    const updateData: Prisma.BudgetsTableUpdateInput = {};

    if (affectedFields.get('total_exp')) updateData.total_exp = totals.total;

    MONTH_MAPPING.quarters.forEach((q, i) => {
      if (affectedFields.get(`${q.key}_exp`))
        updateData[`${q.key}_exp` as keyof typeof updateData] = totals.quarterTotals[i];
    });

    MONTH_MAPPING.halfYears.forEach((h, i) => {
      if (affectedFields.get(`${h.key}_exp`))
        updateData[`${h.key}_exp` as keyof typeof updateData] = totals.halfYearTotals[i];
    });

    MONTH_MAPPING.months.forEach((m, i) => {
      if (affectedFields.get(`${m}_exp`))
        updateData[`${m}_exp` as keyof typeof updateData] = monthlyValues[i];
    });

    return updateData;
  }

  getType(): string {
    return 'exp';
  }
}

class IncomeUpdateStrategy implements BudgetUpdateStrategy {
  getFields(affectedFields: Set<string>): Record<string, boolean> {
    const fields: Record<string, boolean> = { total_inc: true };

    MONTH_MAPPING.quarters.forEach((q) => {
      if (affectedFields.has(`${q.key}_inc`)) fields[`${q.key}_inc`] = true;
    });

    MONTH_MAPPING.halfYears.forEach((h) => {
      if (affectedFields.has(`${h.key}_inc`)) fields[`${h.key}_inc`] = true;
    });

    MONTH_MAPPING.months.forEach((m) => {
      if (affectedFields.has(`${m}_inc`)) fields[`${m}_inc`] = true;
    });

    return fields;
  }

  calculateTotals(monthlyValues: number[]): BudgetTotals {
    let total = 0;
    const quarterTotals = [0, 0, 0, 0];
    const halfYearTotals = [0, 0];

    monthlyValues.forEach((value, index) => {
      total += value;
      const quarterIndex = Math.floor(index / 3);
      quarterTotals[quarterIndex] += value;
      const halfYearIndex = index < 6 ? 0 : 1;
      halfYearTotals[halfYearIndex] += value;
    });

    return { total, quarterTotals, halfYearTotals };
  }

  prepareUpdateData(
    totals: BudgetTotals,
    monthlyValues: number[],
    affectedFields: Map<string, boolean>,
  ): Prisma.BudgetsTableUpdateInput {
    const updateData: Prisma.BudgetsTableUpdateInput = {};

    if (affectedFields.get('total_inc')) updateData.total_inc = totals.total;

    MONTH_MAPPING.quarters.forEach((q, i) => {
      if (affectedFields.get(`${q.key}_inc`))
        updateData[`${q.key}_inc` as keyof typeof updateData] = totals.quarterTotals[i];
    });

    MONTH_MAPPING.halfYears.forEach((h, i) => {
      if (affectedFields.get(`${h.key}_inc`))
        updateData[`${h.key}_inc` as keyof typeof updateData] = totals.halfYearTotals[i];
    });

    MONTH_MAPPING.months.forEach((m, i) => {
      if (affectedFields.get(`${m}_inc`))
        updateData[`${m}_inc` as keyof typeof updateData] = monthlyValues[i];
    });

    return updateData;
  }

  getType(): string {
    return 'inc';
  }
}
function getBudgetStrategy(isExpense: boolean): BudgetUpdateStrategy {
  return isExpense ? new ExpenseUpdateStrategy() : new IncomeUpdateStrategy();
}

export { ExpenseUpdateStrategy, IncomeUpdateStrategy, getBudgetStrategy };
