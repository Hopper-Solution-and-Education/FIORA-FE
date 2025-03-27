import { Product } from '@prisma/client';
import { HttpResponse } from '../../../model';

export type GetSingleProductResponseDTO = HttpResponse<Product>;
