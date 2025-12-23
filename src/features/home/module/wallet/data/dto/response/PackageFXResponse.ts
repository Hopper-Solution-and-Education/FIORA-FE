import { _PaginationResponse, HttpResponse } from '@/shared/types';
import { PackageFX } from '../../../domain';

export type PackageFXResponse = HttpResponse<Array<PackageFX>>;
export type PackageFXPaginatedResponse = _PaginationResponse<PackageFX>;
