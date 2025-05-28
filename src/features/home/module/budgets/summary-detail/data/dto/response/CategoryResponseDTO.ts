export interface Category {
  id: string;
  name: string;
  type: 'Income' | 'Expense';
  description?: string;
  createdAt: string;
  updatedAt: string;
  planning?: CategoryPlanning;
}

export interface CategoryResponseDTO {
  code: number;
  message: string;
  data: Category[];
}

export interface CategoryPlanningData {
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
  m7: number;
  m8: number;
  m9: number;
  m10: number;
  m11: number;
  m12: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  h1: number;
  h2: number;
  total: number;
}

export interface CategoryPlanning {
  bottomUp: CategoryPlanningData;
  actual: CategoryPlanningData;
}

export interface CategoryPlanningResponseDTO {
  code: number;
  message: string;
  data: CategoryPlanning;
}
