import { Product } from '@prisma/client';
import { HttpResponse } from '../../../model';

export type ProductUpdateResponseDTO = HttpResponse<Product>;
