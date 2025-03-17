import { Category } from '@prisma/client';
import { PaginationResponse } from '../../model';

export type GetCategoryResponse = PaginationResponse<Category[]>;
