import { Currency } from '@/shared/types';
import { BudgetType } from '@prisma/client';

export class Budget {
  id: string;
  icon: string;
  fiscalYear: string;
  type: BudgetType;
  totalExpense: number;
  totalIncome: number;
  h1Expense: number;
  h1Income: number;
  h2Expense: number;
  h2Income: number;
  q1Expense: number;
  q1Income: number;
  q2Expense: number;
  q2Income: number;
  q3Expense: number;
  q3Income: number;
  q4Expense: number;
  q4Income: number;
  m1Income: number;
  m1Expense: number;
  m2Income: number;
  m2Expense: number;
  m3Income: number;
  m3Expense: number;
  m4Income: number;
  m4Expense: number;
  m5Income: number;
  m5Expense: number;
  m6Income: number;
  m6Expense: number;
  m7Income: number;
  m7Expense: number;
  m8Income: number;
  m8Expense: number;
  m9Income: number;
  m9Expense: number;
  m10Income: number;
  m10Expense: number;
  m11Income: number;
  m11Expense: number;
  m12Income: number;
  m12Expense: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  userId: string;

  constructor(
    id: string,
    icon: string,
    fiscalYear: string,
    type: BudgetType,
    totalExpense: number,
    totalIncome: number,
    h1Expense: number,
    h1Income: number,
    h2Expense: number,
    h2Income: number,
    q1Expense: number,
    q1Income: number,
    q2Expense: number,
    q2Income: number,
    q3Expense: number,
    q3Income: number,
    q4Expense: number,
    q4Income: number,
    m1Income: number,
    m1Expense: number,
    m2Income: number,
    m2Expense: number,
    m3Income: number,
    m3Expense: number,
    m4Income: number,
    m4Expense: number,
    m5Income: number,
    m5Expense: number,
    m6Income: number,
    m6Expense: number,
    m7Income: number,
    m7Expense: number,
    m8Income: number,
    m8Expense: number,
    m9Income: number,
    m9Expense: number,
    m10Income: number,
    m10Expense: number,
    m11Income: number,
    m11Expense: number,
    m12Income: number,
    m12Expense: number,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    updatedBy: string,
    userId: string,
  ) {
    this.id = id;
    this.icon = icon;
    this.userId = userId;
    this.fiscalYear = fiscalYear;
    this.type = type;
    this.totalExpense = totalExpense;
    this.totalIncome = totalIncome;
    this.h1Expense = h1Expense;
    this.h1Income = h1Income;
    this.h2Expense = h2Expense;
    this.h2Income = h2Income;
    this.q1Expense = q1Expense;
    this.q1Income = q1Income;
    this.q2Expense = q2Expense;
    this.q2Income = q2Income;
    this.q3Expense = q3Expense;
    this.q3Income = q3Income;
    this.q4Expense = q4Expense;
    this.q4Income = q4Income;
    this.m1Income = m1Income;
    this.m1Expense = m1Expense;
    this.m2Income = m2Income;
    this.m2Expense = m2Expense;
    this.m3Income = m3Income;
    this.m3Expense = m3Expense;
    this.m4Income = m4Income;
    this.m4Expense = m4Expense;
    this.m5Income = m5Income;
    this.m5Expense = m5Expense;
    this.m6Income = m6Income;
    this.m6Expense = m6Expense;
    this.m7Income = m7Income;
    this.m7Expense = m7Expense;
    this.m8Income = m8Income;
    this.m8Expense = m8Expense;
    this.m9Income = m9Income;
    this.m9Expense = m9Expense;
    this.m10Income = m10Income;
    this.m10Expense = m10Expense;
    this.m11Income = m11Income;
    this.m11Expense = m11Expense;
    this.m12Income = m12Income;
    this.m12Expense = m12Expense;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}

export type BudgetGetRequest = {
  cursor: number | null;
  take: number;
  search: string;
  filters?: {
    fiscalYear: {
      gte: number;
      lte: number;
    };
  };
  currency?: Currency;
};

export type BudgetGetResponse = {
  currency: Currency;
  data: BudgetGetDataResponse[];
  nextCursor: number;
};

export type BudgetGetDataResponse = {
  year: number;
  budgetTopIncome: number;
  budgetTopExpense: number;
  budgetBotIncome: number;
  budgetBotExpense: number;
  budgetActIncome: number;
  budgetActExpense: number;
};

export type BudgetCreateRequest = {
  icon: string;
  fiscalYear: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
};

export type BudgetCreateResponse = {
  id: string;
  icon: string;
  fiscalYear: string;
  type: BudgetType;
  totalExpense: number;
  totalIncome: number;
  h1Expense: number;
  h1Income: number;
  h2Expense: number;
  h2Income: number;
  q1Expense: number;
  q1Income: number;
  q2Expense: number;
  q2Income: number;
  q3Expense: number;
  q3Income: number;
  q4Expense: number;
  q4Income: number;
  m1Income: number;
  m1Expense: number;
  m2Income: number;
  m2Expense: number;
  m3Income: number;
  m3Expense: number;
  m4Income: number;
  m4Expense: number;
  m5Income: number;
  m5Expense: number;
  m6Income: number;
  m6Expense: number;
  m7Income: number;
  m7Expense: number;
  m8Income: number;
  m8Expense: number;
  m9Income: number;
  m9Expense: number;
  m10Income: number;
  m10Expense: number;
  m11Income: number;
  m11Expense: number;
  m12Income: number;
  m12Expense: number;
};

export type BudgetGetByIdRequest = {
  fiscalYear: string;
  type: 'Top' | 'Bottom';
};

export type BudgetGetByIdResponse = {
  id: string;
  icon: string;
  fiscalYear: string;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
};

export type BudgetDeleteRequest = {
  budgetId: string;
};

export type BudgetDeleteResponse = {
  message: string;
};

export type BudgetUpdateRequest = {
  budgetYear: string;
  icon: string;
  fiscalYear: number;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
  type: 'Top' | 'Bottom';
};

export type BudgetUpdateResponse = {
  icon: string;
  fiscalYear: number;
  estimatedTotalExpense: number;
  estimatedTotalIncome: number;
  description: string;
  currency: Currency;
  type: 'Top' | 'Bot';
};
