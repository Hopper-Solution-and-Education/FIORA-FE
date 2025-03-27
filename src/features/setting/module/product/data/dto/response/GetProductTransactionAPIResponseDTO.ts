import { PaginationResponse } from '@/shared/types/Common.types';
import { CategoryType, ProductType } from '@prisma/client';
import { HttpResponse } from '../../../model';
import { ProductItem } from '../../../presentation/schema/addProduct.schema';

export type getProductTransactionAPIResponseDTO = HttpResponse<
  PaginationResponse<ProductTransactionResponse>
>;

type ProductTransactionResponse = {
  transaction: {
    id: string;
    type: CategoryType;
  };
  product: {
    id: string;
    price: number;
    name: string;
    type: ProductType;
    description: string;
    items: ProductItem[];
    taxRate: number;
    catId: string;
    icon: string;
  };
};
