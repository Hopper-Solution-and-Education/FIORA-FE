import { HttpResponse } from '../../../model';

export type ProductDeleteResponseDTO = HttpResponse<{ id: string }>;

export type ProductTransferDeleteResponseDTO = HttpResponse<{
  id: string;
}>;
