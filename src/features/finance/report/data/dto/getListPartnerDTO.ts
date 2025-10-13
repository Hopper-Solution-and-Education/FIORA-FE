import { HttpResponse, Pagination } from '@/shared/types';
import { Partner } from '../../domain/entities';

export type GetListPartnersRequestDTO = Pagination;

export type GetListPartnersResponseDTO = HttpResponse<Partner[]>;
