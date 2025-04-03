import { PaginationResponse } from '@/shared/types/Common.types';
import { Product } from '../../../domain/entities/Product';
import { HttpResponse } from '../../../model';

export type ProductsGetResponseDTO = HttpResponse<PaginationResponse<Product>>;
