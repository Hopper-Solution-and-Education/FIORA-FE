import { HttpResponse } from '../../../model';

export type CategoryProductUpdateResponseDTO = HttpResponse<{
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  tax_rate: number | null;
}>;
