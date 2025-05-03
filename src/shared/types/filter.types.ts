import { ReactNode } from 'react';

export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'some'
  | 'every';

export type FilterComparator = 'AND' | 'OR';

export enum FilterColumn {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface FilterComponentConfig {
  key: string;
  component: ReactNode;
  column: FilterColumn;
  order: number;
}

export interface FilterLayoutConfig {
  components: FilterComponentConfig[];
}

export type OrderType = 'asc' | 'desc' | 'none';

export type FilterCriteria = {
  filters?: any;
  sortBy?: {
    [key: string]: OrderType;
  };
  userId: string;
  search?: string;
};

// Define a generic field mapping for filter conversion
export interface FilterFieldMapping<T = any> {
  key: keyof T;
  mapping?: {
    field: string;
    nestedField?: string;
    operator?: string;
    transform?: (value: any) => any;
  };
  condition?: (value: any) => boolean;
  comparator: 'AND' | 'OR';
}
