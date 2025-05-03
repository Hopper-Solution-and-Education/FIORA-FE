import { COLORS, STACK_TYPE } from '@/shared/constants/chart';
import { BudgetGetDataResponse } from '../domain/entities/Budget';

export const mapBudgetToData = (budget: BudgetGetDataResponse): any[] => {
  return [
    {
      name: 'Expense',
      type: STACK_TYPE.EXPENSE,
      icon: 'banknoteArrowDown',
      A: budget.budgetActExpense,
      T: budget.budgetTopExpense,
      B: budget.budgetBotExpense,
      colors: {
        A: COLORS.DEPS_DANGER.LEVEL_1,
        T: COLORS.DEPS_DANGER.LEVEL_3,
        B: COLORS.DEPS_DANGER.LEVEL_5,
      },
    },
    {
      name: 'Income',
      type: STACK_TYPE.INCOME,
      icon: 'banknote',
      A: budget.budgetActIncome,
      T: budget.budgetTopIncome,
      B: budget.budgetBotIncome,
      colors: {
        A: COLORS.DEPS_SUCCESS.LEVEL_1,
        T: COLORS.DEPS_SUCCESS.LEVEL_3,
        B: COLORS.DEPS_SUCCESS.LEVEL_5,
      },
    },
    {
      name: 'Profit',
      type: STACK_TYPE.PROFIT,
      icon: 'handCoins',
      A: budget.budgetActIncome - budget.budgetActExpense,
      T: Math.max(budget.budgetTopIncome - budget.budgetTopExpense, 0),
      B: Math.max(budget.budgetBotIncome - budget.budgetBotExpense, 0),
      colors: {
        A: COLORS.DEPS_INFO.LEVEL_1,
        T: COLORS.DEPS_INFO.LEVEL_3,
        B: COLORS.DEPS_INFO.LEVEL_5,
      },
    },
  ];
};

export const legendItems = [
  {
    name: 'Expense',
    color: COLORS.DEPS_DANGER.LEVEL_1,
  },
  {
    name: 'Income',
    color: COLORS.DEPS_SUCCESS.LEVEL_1,
  },
  {
    name: 'Profit',
    color: COLORS.DEPS_INFO.LEVEL_1,
  },
];
