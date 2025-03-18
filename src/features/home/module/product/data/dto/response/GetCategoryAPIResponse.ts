import { PaginationResponse } from '@/shared/types/Common.types';
import { Category } from '@prisma/client';
import { HttpResponse } from '../../../model';

export type GetCategoriesAPIResponse = HttpResponse<PaginationResponse<Category>>;
