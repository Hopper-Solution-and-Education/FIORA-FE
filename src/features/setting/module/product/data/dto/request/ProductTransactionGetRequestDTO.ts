import { FilterCriteria } from '@/shared/types';
import { Pagination } from '@/shared/types/Common.types';

export type ProductGetTransactionRequestDTO = Pagination &
  FilterCriteria & {
    userId: string;
  };
