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
