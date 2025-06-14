import { Currency, ProductItems } from '@prisma/client';

export interface ProductItemsV {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

export interface ProductType {
  id: string;
  price: number;
  name: string;
  type: string;
  description: string | null;
  items: ProductItem[];
  taxRate: number;
  catId: string | null;
  icon: string | null;
  currency: Currency;
}

export type ProductItem = ProductItems;
