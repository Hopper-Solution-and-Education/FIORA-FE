export type GetFinanceByDateRequest = {
  from: string;
  to: string;
};

export type GetFinanceByDateResponse = FinanceByDate[];

export type FinanceByDate = {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
};
