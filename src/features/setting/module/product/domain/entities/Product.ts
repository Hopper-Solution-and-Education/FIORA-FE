import { PaginationResponse } from '@/shared/types/Common.types';
import { CategoryType, ProductType } from '@prisma/client';
import { ProductFormValues, ProductItem } from '../../presentation/schema/addProduct.schema';

export class Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  taxRate: number;
  items: ProductItem[];
  categoryId: string;
  type: ProductType;
  createdAt: string;
  updatedAt: string;

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
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.price = price;
    this.taxRate = taxRate;
    this.items = items;
    this.categoryId = categoryId;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
  transaction: {
    id: string;
    type: CategoryType;
  } | null;
};
