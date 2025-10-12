import { DynamicFilterGroup, FilterOperator } from '@/shared/types';
import { DEFAULT_MAX_AMOUNT, DEFAULT_MIN_AMOUNT } from '../../data';

/**
 * Converts a DynamicFilterGroup to URL parameters for wallet deposit requests
 *
 * This function extracts filter criteria from a filter group and converts them
 * into URL-friendly parameters that can be used for navigation and API calls.
 *
 * @param filter - The dynamic filter group containing filter rules
 * @returns Object with extracted parameters: status array, amount range, and search term
 */
export function filterGroupToParams(filter: DynamicFilterGroup) {
  // Initialize default values for all filter parameters
  let status: string[] = [];
  let type: string[] = [];
  let amountMin = DEFAULT_MIN_AMOUNT;
  let amountMax = DEFAULT_MAX_AMOUNT;
  let search = '';

  // Process each filter rule to extract parameter values
  (filter.rules || []).forEach((rule) => {
    if ('field' in rule) {
      // Extract status filter - handles multiple status values
      if (rule.field === 'status' && rule.operator === FilterOperator.IN) {
        status = Array.isArray(rule.value)
          ? rule.value.filter((v): v is string => typeof v === 'string')
          : [];
      }

      // Extract type filter - handles multiple type values
      if (rule.field === 'type' && rule.operator === FilterOperator.IN) {
        type = Array.isArray(rule.value)
          ? rule.value.filter((v): v is string => typeof v === 'string')
          : [];
      }

      // Extract amount range filter - handles min/max amount values
      if (rule.field === 'amount' && rule.operator === FilterOperator.BETWEEN) {
        if (Array.isArray(rule.value)) {
          amountMin = typeof rule.value[0] === 'number' ? rule.value[0] : DEFAULT_MIN_AMOUNT;
          amountMax = typeof rule.value[1] === 'number' ? rule.value[1] : DEFAULT_MAX_AMOUNT;
        }
      }

      // Extract search term filter - handles text search
      if (rule.field === 'search' && rule.operator === FilterOperator.CONTAINS) {
        search = typeof rule.value === 'string' ? rule.value : '';
      }
    }
  });

  return { status, type, amountMin, amountMax, search };
}

/**
 * Converts URL parameters back to a DynamicFilterGroup for API requests
 *
 * This function takes URL parameters and reconstructs a filter group that
 * can be used for API calls. It handles validation and default values.
 *
 * @param params - URL parameters object containing filter values
 * @returns DynamicFilterGroup with constructed filter rules
 */
export function paramsToFilterGroup(params: any): DynamicFilterGroup {
  const rules = [];

  // Filter out 'all' status and create status filter rule
  const statusValues = (params.status || []).filter((v: string) => v !== 'all');

  // Filter out 'all' type and create type filter rule
  const typeValues = (params.type || []).filter((v: string) => v !== 'all');

  // Add search filter rule if search term exists and is not empty
  if (params.search && params.search.trim() !== '') {
    rules.push({ field: 'search', operator: FilterOperator.CONTAINS, value: params.search });
  }

  // Add status filter rule if specific statuses are selected
  if (statusValues.length > 0) {
    rules.push({ field: 'status', operator: FilterOperator.IN, value: statusValues });
  }

  // Add type filter rule if specific types are selected
  if (typeValues.length > 0) {
    rules.push({ field: 'type', operator: FilterOperator.IN, value: typeValues });
  }

  // Validate and extract amount range parameters
  const min = typeof params.amountMin === 'number' ? params.amountMin : DEFAULT_MIN_AMOUNT;
  const max = typeof params.amountMax === 'number' ? params.amountMax : DEFAULT_MAX_AMOUNT;

  // Add amount filter rule only if custom range is specified (not default values)
  if (min !== DEFAULT_MIN_AMOUNT || max !== DEFAULT_MAX_AMOUNT) {
    rules.push({ field: 'amount', operator: FilterOperator.BETWEEN, value: [min, max] });
  }

  return { condition: 'AND' as const, rules };
}
