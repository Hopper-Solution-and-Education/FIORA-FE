import { FilterOperator } from '../../../shared/types/filter.types';

// Type for direct filter editing
export type FilterEditorProps<T = any> = {
  currentFilter: T;
  target: string;
  value: string | number | boolean;
  comparator: string;
  callBack: (newFilter: T) => void;
  subTarget?: string;
  operator?: FilterOperator;
};

/**
 * Utility function to edit filter criteria
 * @param props Filter editing props
 */
export const handleEditFilter = <T = any>(props: FilterEditorProps<T>) => {
  const { currentFilter, callBack, target, value, comparator, subTarget, operator } = props;

  let newFilterCriteria: T | any = { ...currentFilter };

  if (!operator && !subTarget) {
    newFilterCriteria = {
      ...newFilterCriteria,
      filters: {
        ...newFilterCriteria.filters,
        [comparator]: [
          ...((newFilterCriteria.filters?.[comparator] as object[]) ?? []),
          { [target]: value },
        ],
      },
    };
  } else if (!operator && subTarget) {
    newFilterCriteria = {
      ...newFilterCriteria,
      filters: {
        ...newFilterCriteria.filters,
        [comparator]: [
          ...((newFilterCriteria.filters?.[comparator] as object[]) ?? []),
          { [target]: { [subTarget as string]: value } },
        ],
      },
    };
  } else if (operator && subTarget) {
    newFilterCriteria = {
      ...newFilterCriteria,
      filters: {
        ...newFilterCriteria.filters,
        [comparator]: [
          ...((newFilterCriteria.filters?.[comparator] as object[]) ?? []),
          {
            [operator]: {
              ...((newFilterCriteria.filters?.[operator] as object) ?? {}),
              [target]: { [subTarget as string]: value },
            },
          },
        ],
      },
    };
  }

  callBack(newFilterCriteria);
};
