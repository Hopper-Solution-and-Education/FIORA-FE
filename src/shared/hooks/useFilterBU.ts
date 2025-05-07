import { FilterComparator, FilterOperator } from '../types';

type FilterProps<T = any> = {
  currentFilter: T;
  target: string;
  value: string | number | boolean;
  comparator: FilterComparator;
  callBack: (newFilter: T) => void;
  subTarget?: string;
  operator?: FilterOperator;
};

export const editFilterBU = <T = any>(props: FilterProps<T>) => {
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
