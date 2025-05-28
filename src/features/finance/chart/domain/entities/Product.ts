import { Pagination, PaginationResponse } from '@/shared/types/Common.types';

enum ProductType {
  Edu = 'Edu',
  Product = 'Product',
  Service = 'Service',
}

export class Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  taxRate: number;
  catId: string;
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
    this.catId = categoryId;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export type GetListProductResponse = PaginationResponse<Product>;
export type GetListProductRequest = Pagination;
