export const BudgetType = {
  Top: 0,
  Bot: 1,
  Act: 2,
} as const;

export type BudgetType = (typeof BudgetType)[keyof typeof BudgetType];
