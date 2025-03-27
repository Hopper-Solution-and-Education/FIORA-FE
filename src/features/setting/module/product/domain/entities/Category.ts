import { PaginationResponse } from '@/shared/types/Common.types';

export class CategoryProductPage {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string | null;
  taxRate: number | null;

  constructor(
    id: string,
    userId: string,
    icon: string,
    name: string,
    description: string | null,
    taxRate: number | null,
  ) {
    this.id = id;
    this.userId = userId;
    this.icon = icon;
    this.name = name;
    this.description = description;
    this.taxRate = taxRate;
  }
}

export type GetCategoryResponse = PaginationResponse<CategoryProductPage>;
