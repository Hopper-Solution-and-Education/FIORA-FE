import { BaseResponse } from '@/shared/types';
import { Product } from '../../../domain/entities/Product';

export type ProductUpdateResponseDTO = BaseResponse<Product>;
