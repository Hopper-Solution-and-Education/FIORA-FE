import { PaginationResponse } from '@/shared/types/Common.types';
import { CategoryType, ProductType } from '@prisma/client';
import { HttpResponse } from '../../../model';
import { ProductItem } from '../../../presentation/schema/addProduct.schema';

export type ProductGetTransactionResponseDTO = HttpResponse<
  PaginationResponse<ProductTransactionCategoryResponse>
>;

type ProductTransactionCategoryResponse = {
  category: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    tax_rate: number | null;
    created_at: string;
    updated_at: string;
  };
  products: ProductTransactionResponse[];
};

export type ProductTransactionResponse = {
  product: {
    id: string;
    price: number;
    name: string;
    type: ProductType;
    description: string | null;
    items: ProductItem[] | null;
    taxRate: number | null;
    catId: string | null;
    icon: string;
    created_at: string;
    updated_at: string;
  };
  transaction: {
    id: string;
    type: CategoryType;
  } | null;
};
