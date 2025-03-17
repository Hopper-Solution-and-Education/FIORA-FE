import { PaginationResponse } from '../../model';

export class CategoryProductPage {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string | null;
  price: number;
  taxRate: number | null;

  constructor(
    id: string,
    userId: string,
    icon: string,
    name: string,
    description: string | null,
    price: number,
    taxRate: number | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.price = price;
    this.taxRate = taxRate;
  }
}

export type GetCategoryResponse = PaginationResponse<CategoryProductPage[]>;
