import { Product } from '@prisma/client';
import { HttpResponse } from '../../../model';
import { PaginationResponse } from '@/shared/types/Common.types';

export type GetProductAPIResponse = HttpResponse<PaginationResponse<Product>>;
