import {
  DynamicFilterCondition,
  DynamicFilterGroup,
  DynamicFilterRule,
  FilterObject,
  FilterOperator,
} from '../types/filter.types';

/**
 * Get all supported filter operators as an array (for dynamic use)
 */
export function getSupportedFilterOperators(): FilterOperator[] {
  return Object.values(FilterOperator);
}

/**
 * Class to build and parse filter objects for backend and frontend
 * Provides static methods for easy and dynamic usage
 */
export class FilterBuilder {
  /**
   * Build a single filter rule into backend query format
   * @param rule DynamicFilterRule
   * @returns FilterObject for this rule
   */
  static buildRule(rule: DynamicFilterRule): FilterObject {
    const { field, operator, value } = rule;
    switch (operator) {
      case FilterOperator.BETWEEN:
        return {
          [field]: { gte: (value as [number, number])[0], lte: (value as [number, number])[1] },
        };
      case FilterOperator.IN:
        return { [field]: { in: value as (string | number)[] } };
      case FilterOperator.GTE:
        return { [field]: { gte: value as number } };
      case FilterOperator.GT:
        return { [field]: { gt: value as number } };
      case FilterOperator.LTE:
        return { [field]: { lte: value as number } };
      case FilterOperator.LT:
        return { [field]: { lt: value as number } };
      case FilterOperator.CONTAINS:
        return { [field]: { contains: value as string } };
      case FilterOperator.STARTS_WITH:
        return { [field]: { startsWith: value as string } };
      case FilterOperator.ENDS_WITH:
        return { [field]: { endsWith: value as string } };
      case FilterOperator.EQUALS:
      default:
        return { [field]: value };
    }
  }

  /**
   * Recursively build a dynamic filter group into backend query format
   * @param group DynamicFilterGroup
   * @returns FilterObject
   */
  static buildDynamicFilter(group: DynamicFilterGroup): FilterObject {
    const { condition, rules } = group;
    const arr = rules.map((rule) =>
      'condition' in rule
        ? FilterBuilder.buildDynamicFilter(rule)
        : FilterBuilder.buildRule(rule as DynamicFilterRule),
    );
    return { [condition]: arr };
  }

  /**
   * Parse a backend filter object back into DynamicFilterGroup structure
   * @param filterObj FilterObject
   * @returns DynamicFilterGroup
   */
  static parseDynamicFilter(filterObj: FilterObject): DynamicFilterGroup {
    // Find the condition key (AND/OR)
    const condition = (Object.keys(filterObj)[0] as DynamicFilterCondition) || 'AND';
    const rulesArr = (filterObj as any)[condition] as any[];

    const rules = rulesArr.map((item: any) => {
      // If item is a group (AND/OR), recurse
      if (typeof item === 'object' && (item.AND || item.OR)) {
        return FilterBuilder.parseDynamicFilter(item);
      }
      // Otherwise, it's a rule
      // Find the field and operator
      const field = Object.keys(item)[0];
      const valueObj = item[field];
      if (typeof valueObj === 'object' && valueObj !== null) {
        // Special case: between (gte + lte)
        if ('gte' in valueObj && 'lte' in valueObj) {
          return {
            field,
            operator: FilterOperator.BETWEEN,
            value: [valueObj.gte, valueObj.lte],
          } as DynamicFilterRule;
        }
        // Try to find the operator using the enum
        for (const op of getSupportedFilterOperators()) {
          const opKey = op as keyof typeof valueObj;
          if (opKey in valueObj) {
            return {
              field,
              operator: op,
              value: valueObj[opKey],
            } as DynamicFilterRule;
          }
        }
        // Special case: gte, gt, lte, lt
        if ('gte' in valueObj) {
          return { field, operator: FilterOperator.GTE, value: valueObj.gte } as DynamicFilterRule;
        }
        if ('gt' in valueObj) {
          return { field, operator: FilterOperator.GT, value: valueObj.gt } as DynamicFilterRule;
        }
        if ('lte' in valueObj) {
          return { field, operator: FilterOperator.LTE, value: valueObj.lte } as DynamicFilterRule;
        }
        if ('lt' in valueObj) {
          return { field, operator: FilterOperator.LT, value: valueObj.lt } as DynamicFilterRule;
        }
      }
      // Fallback: equals
      return {
        field,
        operator: FilterOperator.EQUALS,
        value: valueObj,
      } as DynamicFilterRule;
    });

    return {
      condition,
      rules,
    };
  }

  /**
   * Convert a plain object to a FilterObject (for type safety)
   * @param obj Plain JS object
   * @returns FilterObject
   */
  static toFilterObject(obj: object): FilterObject {
    return obj as FilterObject;
  }
}

// For backward compatibility, export the main functions
export const buildDynamicFilter = FilterBuilder.buildDynamicFilter;
export const parseDynamicFilter = FilterBuilder.parseDynamicFilter;
