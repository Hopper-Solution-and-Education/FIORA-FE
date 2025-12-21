import { BaseResponse } from '@/shared/types';

export type CategoryProductDeleteResponseDTO = BaseResponse<{
  message: string;
  categoryProductId: string;
}>;
