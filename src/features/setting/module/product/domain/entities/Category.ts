import { PaginatedResult } from '@/shared/types';

export class CategoryProduct {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string | null;
  taxRate: number | null;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: string,
    userId: string,
    icon: string,
    name: string,
    description: string | null,
    taxRate: number | null,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.taxRate = taxRate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export type CategoryProductGetResponse = PaginatedResult<CategoryProduct>;
export type CategoryProductCreateRequest = Omit<CategoryProduct, 'id'>;
export type CategoryProductUpdateRequest = CategoryProduct;
export type CategoryProductDeleteRequest = { productCategoryId: string };
export type CategoryProductCreateResponse = Omit<CategoryProduct, 'userId'>;
export type CategoryProductUpdateResponse = CategoryProduct;
export type CategoryProductDeleteResponse = { message: string; categoryProductId: string };
