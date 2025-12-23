import { CustomBarItem } from '@/components/common/charts/stacked-bar-chart/type';
import { COLORS, STACK_TYPE } from '@/shared/constants';
import { Currency, ExchangeAmountParams, ExchangeAmountResult } from '@/shared/types';
import { BudgetGetDataResponse } from '../domain/entities/Budget';

export const mapBudgetToData = (
  budget: BudgetGetDataResponse,
  budgetCurrency: Currency,
  targetCurrency: Currency,
  getExchangeRateAmount: (params: ExchangeAmountParams) => ExchangeAmountResult,
): CustomBarItem[] => {
  // Use convertCurrency for each budget value
  const convertedActExpense = getExchangeRateAmount({
    amount: budget.budgetActExpense,
    fromCurrency: budgetCurrency,
    toCurrency: targetCurrency,
  }).convertedAmount;

  const convertedTopExpense = getExchangeRateAmount({
    amount: budget.budgetTopExpense,
    fromCurrency: budgetCurrency,
    toCurrency: targetCurrency,
  }).convertedAmount;

  const convertedBotExpense = getExchangeRateAmount({
    amount: budget.budgetBotExpense,
    fromCurrency: budgetCurrency,
    toCurrency: targetCurrency,
  }).convertedAmount;

  const convertedActIncome = getExchangeRateAmount({
    amount: budget.budgetActIncome,
    fromCurrency: budgetCurrency,
    toCurrency: targetCurrency,
  }).convertedAmount;

  const convertedTopIncome = getExchangeRateAmount({
    amount: budget.budgetTopIncome,
    fromCurrency: budgetCurrency,
    toCurrency: targetCurrency,
  }).convertedAmount;

  const convertedBotIncome = getExchangeRateAmount({
    amount: budget.budgetBotIncome,
    fromCurrency: budgetCurrency,
    toCurrency: targetCurrency,
  }).convertedAmount;

  // Calculate profit using the converted values
  const convertedActProfit = convertedActIncome - convertedActExpense;
  // Ensure Top/Bot profit is not negative after conversion if income is less than expense
  const convertedTopProfit = convertedTopIncome - convertedTopExpense;
  const convertedBotProfit = convertedBotIncome - convertedBotExpense;

  return [
    {
      name: 'Expense',
      type: STACK_TYPE.EXPENSE,
      icon: 'banknoteArrowDown',
      A: convertedActExpense,
      T: convertedTopExpense,
      B: convertedBotExpense,
      colors: {
        A: COLORS.DEPS_DANGER.LEVEL_1,
        B: COLORS.DEPS_DANGER.LEVEL_3,
        T: COLORS.DEPS_DANGER.LEVEL_5,
      },
    },
    {
      name: 'Income',
      type: STACK_TYPE.INCOME,
      icon: 'banknote',
      A: convertedActIncome,
      T: convertedTopIncome,
      B: convertedBotIncome,
      colors: {
        A: COLORS.DEPS_SUCCESS.LEVEL_1,
        B: COLORS.DEPS_SUCCESS.LEVEL_3,
        T: COLORS.DEPS_SUCCESS.LEVEL_5,
      },
    },
    {
      name: 'Profit',
      type: STACK_TYPE.PROFIT,
      icon: 'handCoins',
      A: convertedActProfit,
      T: convertedTopProfit,
      B: convertedBotProfit,
      colors: {
        A: COLORS.DEPS_INFO.LEVEL_1,
        B: COLORS.DEPS_INFO.LEVEL_3,
        T: COLORS.DEPS_INFO.LEVEL_5,
      },
    },
  ];
};

export const legendItems = [
  { name: 'Expense', color: COLORS.DEPS_DANGER.LEVEL_1 },
  { name: 'Income', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
  { name: 'Profit', color: COLORS.DEPS_INFO.LEVEL_1 },
];
