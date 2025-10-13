import { PaginationResponse } from '@/shared/types';
import { CategoryProducts } from '@prisma/client';
import { HttpResponse } from '../../../model';

export type CategoryProductGetResponseDTO = HttpResponse<PaginationResponse<CategoryProducts>>;
