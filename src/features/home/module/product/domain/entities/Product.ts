import { PaginationResponse } from '@/shared/types/Common.types';
import { ProductType } from '@prisma/client';
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
  }
}

export class CreateProductResponse {}

export type GetProductResponse = PaginationResponse<Product>;

export type UpdateProductResponse = Product;
export type UpdateProductRequest = ProductFormValues;
