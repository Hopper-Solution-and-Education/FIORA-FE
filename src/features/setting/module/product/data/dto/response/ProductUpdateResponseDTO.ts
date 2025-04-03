import { Product } from '../../../domain/entities/Product';
import { HttpResponse } from '../../../model';

export type ProductUpdateResponseDTO = HttpResponse<Product>;
