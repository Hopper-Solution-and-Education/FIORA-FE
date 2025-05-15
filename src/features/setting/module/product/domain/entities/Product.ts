import { PaginationResponse } from '@/shared/types/Common.types';
import { CategoryType, ProductType } from '@prisma/client';
import { ProductFormValues, ProductItem } from '../../presentation/schema/addProduct.schema';
import { Transaction } from './Transaction';
import { CreatedBy, UpdatedBy } from '@/shared/types';
export class Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  taxRate: number;
  items: ProductItem[];
  transactions: Transaction[];
  catId: string;
  type: ProductType;
  currency: string;
  createdAt: string;
  updatedAt: string;
  createdBy: CreatedBy;
  updatedBy: UpdatedBy;

  constructor(
    id: string,
    name: string,
    description: string,
    icon: string,
    price: number,
    taxRate: number,
    items: ProductItem[] = [],
    categoryId: string,
    type: ProductType,
    createdAt: string,
    updatedAt: string,
    transactions: Transaction[] = [],
    currency: string,
    createdBy: CreatedBy,
    updatedBy: UpdatedBy,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.price = price;
    this.taxRate = taxRate;
    this.items = items;
    this.transactions = transactions;
    this.catId = categoryId;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.currency = currency;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}

export class ProductCreateResponse {}

export type ProductsGetResponse = PaginationResponse<Product>;

export type ProductGetSingleResponse = Product;

export type ProductUpdateRequest = ProductFormValues;
export type ProductUpdateResponse = Product;

export type ProductDeleteRequest = {
  id: string;
};

export type ProductDeleteResponse = {
  id: string;
};

export type ProductTransferDeleteRequest = {
  productIdToDelete: string;
  productIdToTransfer: string;
};

export type ProductTransferDeleteResponse = {
  id: string;
};

export type ProductGetTransactionRequest = {
  userId: string;
  page: number;
  pageSize: number;
};

export type ProductGetTransactionResponse = PaginationResponse<ProductTransactionCategoryResponse>;

export type ProductTransactionCategoryResponse = {
  category: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
    taxRate: number | null;
    createdAt: string;
    updatedAt: string;
  };
  products: ProductTransactionResponse[]; // Thêm products vào đây để khớp response
};

// Type cho sản phẩm và giao dịch (Product và Transaction qua ProductTransaction)
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
    createdAt: string;
    updatedAt: string;
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
