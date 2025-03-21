import { CategoryProductPage } from '../../domain/entities/Category';
import { Product, ProductTransactionResponse } from '../../domain/entities/Product';

export type DialogStateType = 'add' | 'edit';

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
  isOpenDialogAddEdit: boolean;
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
    data: ProductTransactionResponse[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
  error: string | null;
  dialogState: DialogStateType;
}

export const initialProductState: CategoryState = {
  categories: {
    isLoading: false,
    data: [],
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  },
  products: {
    isLoading: false,
    items: [],
    page: 1,
    pageSize: 10,
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
  isOpenDialogAddEdit: false,
  isDeletingProduct: false,
  dialogState: 'add',
};
