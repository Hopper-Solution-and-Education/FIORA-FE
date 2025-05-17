import { FilterCriteria } from '@/shared/types';

// Define the default filter criteria
export const DEFAULT_DASHBOARD_FILTER_CRITERIA: FilterCriteria = {
  userId: '',
  filters: {},
};

// Define the filter parameters type
export type FilterParams = {
  products: string[];
  expenseMin: number;
  expenseMax: number;
  priceMin: number;
  priceMax: number;
  taxRateMin: number;
  taxRateMax: number;
  incomeMin: number;
  incomeMax: number;
};
