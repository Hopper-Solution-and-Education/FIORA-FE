import { HttpResponse } from '@/shared/types';
import { Membership } from '../../domain/entities';

export type GetListMembershipsRequestDTO = {
  page: number;
  limit: number;
};

export type GetListMembershipsResponseDTO = HttpResponse<Membership[]>;
