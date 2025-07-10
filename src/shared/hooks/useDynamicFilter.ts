import { useCallback } from 'react';
import { DynamicFilterGroup } from '../types/filter.types';
import { buildDynamicFilter } from '../utils/filterBuilder';

export function useDynamicFilter() {
  const getFilterObject = useCallback((group: DynamicFilterGroup) => {
    return buildDynamicFilter(group);
  }, []);

  return { getFilterObject };
}
