import { FilterCriteria, Pagination } from '@/shared/types';

export type ProductGetTransactionRequestDTO = Pagination &
  FilterCriteria & {
    userId: string;
  };
