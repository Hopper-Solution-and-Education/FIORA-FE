import { DynamicFilterGroup, DynamicFilterRule } from '../types/filter.types';

function buildRule(rule: DynamicFilterRule): any {
  const { field, operator, value } = rule;

  switch (operator) {
    case 'between':
      return { [field]: { gte: value[0], lte: value[1] } };
    case 'in':
      return { [field]: { in: value } };
    case 'gte':
      return { [field]: { gte: value } };
    case 'gt':
      return { [field]: { gt: value } };
    case 'lte':
      return { [field]: { lte: value } };
    case 'lt':
      return { [field]: { lt: value } };
    case 'contains':
    case 'startsWith':
    case 'endsWith':
      return { [field]: { [operator]: value } };
    case 'equals':
    default:
      return { [field]: value };
  }
}

// Đệ quy chuyển group filter thành object filter cho BE
export function buildDynamicFilter(group: DynamicFilterGroup): any {
  const { condition, rules } = group;
  const arr = rules.map((rule) =>
    'condition' in rule ? buildDynamicFilter(rule) : buildRule(rule as DynamicFilterRule),
  );
  return { [condition]: arr };
}
