import { BudgetsTable, BudgetType, Currency, Prisma } from '@prisma/client';

export interface BudgetCreationParams {
  userId: string;
  fiscalYear: number;
  description: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  icon: string;
  currency: Currency;
  isSystemGenerated?: boolean;
  type?: BudgetsTable['type'];
  skipActCalculation?: boolean;
}

export interface BudgetUpdateParams {
  budgetId: string;
  userId: string;
  fiscalYear: number;
  description: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  icon: string;
  currency: Currency;
  type: BudgetType;
}

export interface BudgetAllocation {
  monthFields: Record<string, number>;
  quarterFields: Record<string, number>;
  halfYearFields: { h1_exp: number; h2_exp: number; h1_inc: number; h2_inc: number };
  monthlyExpense: number;
  monthlyIncome: number;
}

export interface SumUpAllocation {
  monthFields: Record<string, number>;
  quarterFields: Record<string, number>;
  halfYearFields: { h1_exp?: number; h2_exp?: number; h1_inc?: number; h2_inc?: number };
}

export interface BudgetTypeData {
  type: BudgetsTable['type'];
  totalExpense: number;
  totalIncome: number;
}

export type FetchTransactionResponse = Prisma.TransactionGetPayload<{
  select: {
    id: true;
    type: true;
    amount: true;
    currency: true;
  };
}>;

export interface BudgetGetAnnualYearParams {
  userId: string;
  cursor?: number;
  take: number;
  currency: Currency;
  search?: string;
  filters?: any;
}

export type BudgetYearSummary = {
  year: number;
  budgetIncome: number;
  budgetExpense: number;
  actualIncome: number;
  actualExpense: number;
};

export type BudgetSummaryByYear = Record<
  string,
  Record<
    string,
    {
      total_inc: Prisma.Decimal;
      total_exp: Prisma.Decimal;
      currency: Currency;
      icon: string;
    }
  >
>;
