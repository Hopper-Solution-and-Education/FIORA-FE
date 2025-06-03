import { Budget } from '../../../domain/entities/Budget';
import { BudgetType } from '../../../domain/entities/BudgetType';

export interface BudgetDTO {
  id: string;
  user_id: string;
  fiscal_year: string;
  type: BudgetType;
  total_exp: number;
  total_inc: number;
  h1_exp: number;
  h1_inc: number;
  h2_exp: number;
  h2_inc: number;
  q1_exp: number;
  q1_inc: number;
  q2_exp: number;
  q2_inc: number;
  q3_exp: number;
  q3_inc: number;
  q4_exp: number;
  q4_inc: number;
  m1_exp: number;
  m1_inc: number;
  m2_exp: number;
  m2_inc: number;
  m3_exp: number;
  m3_inc: number;
  m4_exp: number;
  m4_inc: number;
  m5_exp: number;
  m5_inc: number;
  m6_exp: number;
  m6_inc: number;
  m7_exp: number;
  m7_inc: number;
  m8_exp: number;
  m8_inc: number;
  m9_exp: number;
  m9_inc: number;
  m10_exp: number;
  m10_inc: number;
  m11_exp: number;
  m11_inc: number;
  m12_exp: number;
  m12_inc: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface BudgetSummaryResponseDTO {
  topBudget: Budget | null;
  botBudget: Budget | null;
  actBudget: Budget | null;
  allBudgets: Budget[];
}

export interface BudgetByTypeResponseDTO {
  code: number;
  message: string;
  data: BudgetDTO;
}

export type BudgetYearsResponseDTO = string[];
