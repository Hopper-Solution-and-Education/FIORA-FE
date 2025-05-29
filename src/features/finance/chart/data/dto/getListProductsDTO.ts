import { HttpResponse } from '@/shared/types';
import { Pagination, PaginationResponse } from '@/shared/types/Common.types';
import { Product } from '../../domain/entities';

export type GetListProductsRequestDTO = Pagination;

export type GetListProductsResponseDTO = HttpResponse<PaginationResponse<Product>>;
