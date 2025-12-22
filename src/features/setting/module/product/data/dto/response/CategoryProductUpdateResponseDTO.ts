import { BaseResponse } from '@/shared/types';

export type CategoryProductUpdateResponseDTO = BaseResponse<{
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  tax_rate: number | null;
}>;
