import { HttpResponse } from '@/shared/types';
import { Pagination } from '@/shared/types/Common.types';
import { Partner } from '../../domain/entities';

export type GetListPartnersRequestDTO = Pagination;

export type GetListPartnersResponseDTO = HttpResponse<Partner[]>;
