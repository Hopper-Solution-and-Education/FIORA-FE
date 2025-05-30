import { CategoryProduct } from '../../domain/entities/Category';
import { Product, ProductTransactionCategoryResponse } from '../../domain/entities/Product';

interface CategoryState {
  categories: {
    isLoading: boolean;
    data: CategoryProduct[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  isCreatingProduct: boolean;
  isUpdatingProduct: boolean;
  isDeletingProduct: boolean;
  isOpenDialogAddCategory: boolean;
  isCreatingProductCategory: boolean;
  isUpdatingProductCategory: boolean;
  isDeletingProductCategory: boolean;
  ProductCategoryFormState: 'add' | 'edit';
  ProductCategoryToEdit: CategoryProduct | null;
  ProductIdToTransfer: string;
  deletedItems: string[];
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
  productDetail: Product | null;
}

export const initialProductState: CategoryState = {
  categories: {
    isLoading: false,
    data: [],
    page: 1,
    limit: 30,
    total: 0,
    hasMore: true,
  },
  products: {
    isLoading: false,
    items: [],
    page: 1,
    pageSize: 30,
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
  isCreatingProduct: false,
  isUpdatingProduct: false,
  isDeletingProduct: false,
  isOpenDialogAddCategory: false,
  isCreatingProductCategory: false,
  isDeletingProductCategory: false,
  isUpdatingProductCategory: false,
  ProductCategoryFormState: 'add',
  ProductCategoryToEdit: null,
  ProductIdToTransfer: '',
  productDetail: null,
  deletedItems: [],
};
