import { HttpResponse } from '@/shared/types';
import { Account } from '../../domain/entities';

export type GetListAccountRequestDTO = {
  page: number;
  pageSize: number;
  search: string;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

export type GetListAccountResponseDTO = HttpResponse<{
  accounts: Account[];
  pagination: Pagination;
}>;
