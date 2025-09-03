import { Currency, ExchangeAmountParams, ExchangeAmountResult } from '@/shared/types';
import { BudgetSummaryByType } from '../domain/entities/BudgetSummaryByType';
// import { convertVNDToUSD } from '@/shared/utils';

const BUDGET_FIELDS = [
  'm1Exp',
  'm2Exp',
  'm3Exp',
  'm4Exp',
  'm5Exp',
  'm6Exp',
  'm7Exp',
  'm8Exp',
  'm9Exp',
  'm10Exp',
  'm11Exp',
  'm12Exp',
  'totalExp',
  'm1Inc',
  'm2Inc',
  'm3Inc',
  'm4Inc',
  'm5Inc',
  'm6Inc',
  'm7Inc',
  'm8Inc',
  'm9Inc',
  'm10Inc',
  'm11Inc',
  'm12Inc',
  'totalInc',
  'q1Exp',
  'q2Exp',
  'q3Exp',
  'q4Exp',
  'q1Inc',
  'q2Inc',
  'q3Inc',
  'q4Inc',
  'h1Exp',
  'h2Exp',
  'h1Inc',
  'h2Inc',
] as const;

export const convertBudgetCurrency = (
  budget: BudgetSummaryByType | null,
  fromCurrency: Currency,
  toCurrency: Currency,
  getExchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult,
): BudgetSummaryByType | null => {
  if (!budget?.budget) return null;

  // If currencies are the same, return original budget
  if (fromCurrency === toCurrency) return budget;

  const convertedBudget = { ...budget };
  const budgetData = { ...budget.budget };

  // Convert each field in the budget
  BUDGET_FIELDS.forEach((field) => {
    const value = budgetData[field as keyof typeof budgetData];
    let numValue = 0;
    if (value !== undefined && (typeof value === 'string' || typeof value === 'number')) {
      numValue = typeof value === 'string' ? parseFloat(value) : value;
      (budgetData as any)[field] = getExchangeAmount({
        amount: numValue,
        fromCurrency,
        toCurrency,
      }).convertedAmount;
    }
  });

  convertedBudget.budget = budgetData;
  return convertedBudget;
};
