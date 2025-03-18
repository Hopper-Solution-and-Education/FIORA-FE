import { PaginationResponse } from '@/shared/types/Common.types';

export class Product {
  name: string;
  description: string;
  icon: string;
  taxRate: number;

  constructor(name: string, description: string, icon: string, taxRate: number) {
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.taxRate = taxRate;
  }
}

export class CreateProductResponse {}

export type GetProductResponse = PaginationResponse<Product>;
