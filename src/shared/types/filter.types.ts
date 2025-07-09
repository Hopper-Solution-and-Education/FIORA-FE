import { ReactNode } from 'react';

/**
 * Enum to define which column a filter component should be placed in
 */
export enum FilterColumn {
  LEFT = 'left',
  RIGHT = 'right',
}

/**
 * Enum for all supported filter operators
 */
export enum FilterOperator {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  BETWEEN = 'between',
  IN = 'in',
}

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
  filters: Record<string, unknown>;
  sortBy?: {
    [key: string]: OrderType;
  };
  userId: string;
  search?: string;
}

/**
 * Interface for field mappings to create complex filter structures
 */
export interface FilterFieldMapping<T = Record<string, unknown>> {
  key: keyof T;
  comparator?: 'AND' | 'OR';
  mapping?: {
    field: string;
    nestedField?: string;
    transform?: (value: unknown) => unknown;
  };
  condition?: (value: unknown) => boolean;
}

export type DynamicFilterCondition = 'AND' | 'OR';

/**
 * Rule for a single filter condition
 */
export interface DynamicFilterRule {
  field: string;
  operator: FilterOperator;
  value: string | number | (string | number)[];
}

/**
 * Group of filter rules (can be nested)
 */
export interface DynamicFilterGroup {
  condition: DynamicFilterCondition;
  rules: (DynamicFilterRule | DynamicFilterGroup)[];
}

/**
 * Type for backend filter object, supports nested AND/OR and all operators
 * More strictly typed for each operator
 */
export type FilterObject =
  | { AND: FilterObject[] }
  | { OR: FilterObject[] }
  | ({
      [field: string]:
        | { gte?: number; lte?: number }
        | { gt?: number }
        | { lt?: number }
        | { in?: (string | number)[] }
        | { contains?: string }
        | { startsWith?: string }
        | { endsWith?: string }
        | { equals?: string | number }
        | string
        | number;
    } & { AND?: never; OR?: never });
