import { PaginationResponse } from '@/shared/types/Common.types';
import { CategoryType, ProductType } from '@prisma/client';
import { ProductItem } from '../../../domain/entities';
import { HttpResponse } from '../../../model';

// Extended pagination response with filter properties
export type ProductTransactionPaginationResponse =
  PaginationResponse<ProductTransactionCategoryResponse> & {
    minPrice?: number;
    maxPrice?: number;
    minTaxRate?: number;
    maxTaxRate?: number;
    minExpense?: number;
    maxExpense?: number;
    minIncome?: number;
    maxIncome?: number;
  };

export type ProductGetTransactionResponseDTO = HttpResponse<ProductTransactionPaginationResponse>;

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
  transactions: [
    {
      id: string;
      type: CategoryType;
      amount: number;
      currency: 'VND' | 'USD';
    } | null,
  ];
};
