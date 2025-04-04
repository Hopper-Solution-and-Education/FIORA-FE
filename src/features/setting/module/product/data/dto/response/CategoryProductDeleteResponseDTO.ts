import { HttpResponse } from '../../../model';

export type CategoryProductDeleteResponseDTO = HttpResponse<{
  message: string;
  categoryProductId: string;
}>;
