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

export class CreateProductResponse {}

export type GetProductResponse = PaginationResponse<Product>;

export type GetSingleProductResponse = Product;

export type UpdateProductResponse = Product;
export type UpdateProductRequest = ProductFormValues;

export type DeleteProductRequest = {
  id: string;
};

export type DeleteProductResponse = {
  id: string;
};

export type GetProductTransactionRequest = {
  userId: string;
  page: number;
  pageSize: number;
};

export type GetProductTransactionResponse = PaginationResponse<ProductTransactionCategoryResponse>;

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
  };
  transaction: {
    id: string;
    type: CategoryType;
  } | null;
};
