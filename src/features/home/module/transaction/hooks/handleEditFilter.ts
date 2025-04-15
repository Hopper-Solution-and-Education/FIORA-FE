import {
  IRelationalTransaction,
  TransactionAccount,
  TransactionCategory,
  TransactionFilterCriteria,
  TransactionFilterOperator,
  TransactionPartner,
} from '../types';

type FilterProps = {
  currentFilter: TransactionFilterCriteria;
  callBack: (newFilter: TransactionFilterCriteria) => void;
  target: keyof IRelationalTransaction;
  value: string | number | boolean;
  comparator: 'AND' | 'OR';
  subTarget?:
    | keyof TransactionAccount
    | keyof TransactionCategory
    | keyof TransactionPartner
    | keyof IRelationalTransaction;
  operator?: TransactionFilterOperator;
};

export const handleEditFilter = (props: FilterProps) => {
  const { currentFilter, callBack, target, value, comparator, subTarget, operator } = props;

  let newFilterCriteria: TransactionFilterCriteria = { ...currentFilter };

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
