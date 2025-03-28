import { CategoryProductPage } from '../../domain/entities/Category';
import { Product, ProductTransactionCategoryResponse } from '../../domain/entities/Product';

interface CategoryState {
  categories: {
    isLoading: boolean;
    data: CategoryProductPage[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  isCreatingProduct: boolean;
  isUpdatingProduct: boolean;
  isDeletingProduct: boolean;
  products: {
    isLoading: boolean;
    items: Product[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  productTransaction: {
    isLoadingGet: boolean;
    data: ProductTransactionCategoryResponse[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  error: string | null;
}

export const initialProductState: CategoryState = {
  categories: {
    isLoading: false,
    data: [],
    page: 1,
    limit: 20,
    total: 0,
    hasMore: true,
  },
  products: {
    isLoading: false,
    items: [],
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: true,
  },
  productTransaction: {
    isLoadingGet: false,
    data: [],
    page: 1,
    pageSize: 10,
    total: 0,
    hasMore: true,
  },
  error: null,
  isCreatingProduct: false,
  isUpdatingProduct: false,
  isDeletingProduct: false,
};
