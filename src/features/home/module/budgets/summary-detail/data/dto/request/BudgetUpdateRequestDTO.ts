export interface MonthlyPlanningData {
  [key: `m${number}_${'exp' | 'inc'}`]: number;
}

export interface TopDownUpdateRequestDTO {
  fiscalYear: string;
  type: 'Expense' | 'Income';
  updateTopBudget: MonthlyPlanningData;
}

export interface CategoryPlanningUpdateRequestDTO {
  fiscalYear: string;
  type: 'Expense' | 'Income';
  categoryId: string;
  bottomUpPlan: MonthlyPlanningData;
  actualSumUpPlan: MonthlyPlanningData;
}
