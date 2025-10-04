import { HttpResponse, Pagination, PaginationResponse } from '@/shared/types';
import { Product } from '../../domain/entities';

export type GetListProductsRequestDTO = Pagination;

export type GetListProductsResponseDTO = HttpResponse<PaginationResponse<Product>>;
