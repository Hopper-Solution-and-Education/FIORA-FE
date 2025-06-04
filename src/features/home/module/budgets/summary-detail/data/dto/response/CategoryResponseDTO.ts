export interface BudgetDetail {
  id: string;
  userId: string;
  budgetId: string;
  type: string;
  categoryId: string;
  month: number;
  amount: number;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BottomUpPlan {
  m1_exp?: number;
  m2_exp?: number;
  m3_exp?: number;
  m4_exp?: number;
  m5_exp?: number;
  m6_exp?: number;
  m7_exp?: number;
  m8_exp?: number;
  m9_exp?: number;
  m10_exp?: number;
  m11_exp?: number;
  m12_exp?: number;
  m1_inc?: number;
  m2_inc?: number;
  m3_inc?: number;
  m4_inc?: number;
  m5_inc?: number;
  m6_inc?: number;
  m7_inc?: number;
  m8_inc?: number;
  m9_inc?: number;
  m10_inc?: number;
  m11_inc?: number;
  m12_inc?: number;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  icon: string;
  bottomUpPlan: BottomUpPlan;
}

export interface CategoryResponseDTO {
  code: number;
  message: string;
  data: Category[];
}

export interface CategoryPlanningData {
  [key: string]: number | string;
}

export interface CategoryPlanning {
  m1_inc?: number;
  m2_inc?: number;
  m3_inc?: number;
  m4_inc?: number;
  m5_inc?: number;
  m6_inc?: number;
  m7_inc?: number;
  m8_inc?: number;
  m9_inc?: number;
  m10_inc?: number;
  m11_inc?: number;
  m12_inc?: number;
  m1_exp?: number;
  m2_exp?: number;
  m3_exp?: number;
  m4_exp?: number;
  m5_exp?: number;
  m6_exp?: number;
  m7_exp?: number;
  m8_exp?: number;
  m9_exp?: number;
  m10_exp?: number;
  m11_exp?: number;
  m12_exp?: number;
  q1_inc: number;
  q2_inc: number;
  q3_inc: number;
  q4_inc: number;
  h1_inc: number;
  h2_inc: number;
  total_inc: number;
  q1_exp: number;
  q2_exp: number;
  q3_exp: number;
  q4_exp: number;
  h1_exp: number;
  h2_exp: number;
  total_exp: number;
  currency: string;
  type: 'Income' | 'Expense';
}

export interface CategoryPlanningResponseDTO {
  status: number;
  message: string;
  data: CategoryPlanning;
}
