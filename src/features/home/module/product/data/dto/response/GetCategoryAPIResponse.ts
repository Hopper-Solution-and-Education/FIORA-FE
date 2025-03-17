import { Category } from '@prisma/client';
import { HttpResponse, PaginationResponse } from '../../../model';

export type GetCategoriesAPIResponse = HttpResponse<PaginationResponse<Category[]>>;
