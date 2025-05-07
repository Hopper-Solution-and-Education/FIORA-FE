import { ReactNode } from 'react';

/**
 * Enum to define which column a filter component should be placed in
 */
export enum FilterColumn {
  LEFT = 'left',
  RIGHT = 'right',
}

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

export type OrderType = 'asc' | 'desc' | 'none';

/**
 * Interface defining a filter component configuration
 */
export interface FilterComponentConfig {
  key: string;
  component: ReactNode;
  column: FilterColumn;
  order: number;
}

/**
 * Basic filter criteria structure
 */
export interface FilterCriteria {
  filters: Record<string, any>;
  sortBy?: {
    [key: string]: OrderType;
  };
  userId: string;
  search?: string;
}

/**
 * Interface for field mappings to create complex filter structures
 */
export interface FilterFieldMapping<T = any> {
  key: keyof T;
  comparator?: 'AND' | 'OR';
  mapping?: {
    field: string;
    nestedField?: string;
    transform?: (value: any) => any;
  };
  condition?: (value: any) => boolean;
}
