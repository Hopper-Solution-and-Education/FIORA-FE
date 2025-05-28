import { HttpResponse } from '@/shared/types';
import { FinanceByCategory } from '../../domain/entities';

export interface GetFinanceWithFilterRequestDTO {
  type: string;
  ids: string[];
}

export type GetFinanceWithFilterResponseDTO = HttpResponse<FinanceByCategory>;
