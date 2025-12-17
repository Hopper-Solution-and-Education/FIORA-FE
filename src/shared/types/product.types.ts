import { Decimal } from '@/types/global';

type ProductItems = {
  name: string;
  id: string;
  description: string | null;
  userId: string;
  productId: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  icon: string;
};

export interface ProductItemsV {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
}

// export interface ProductType {
//   id: string;
//   price: number;
//   name: string;
//   type: string;
//   description: string | null;
//   items: ProductItem[];
//   taxRate: number;
//   catId: string | null;
//   icon: string | null;
//   currency: Currency;
// }

export type ProductType = 'Product' | 'Service' | 'Edu';

export type Product = {
  name: string;
  id: string;
  description: string | null;
  userId: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  icon: string;
  price: Decimal;
  taxRate: Decimal | null;
  type: ProductType;
  catId: string | null;
  currency: string | null;
  currencyId: string | null;
  baseCurrency: string | null;
  baseAmount: Decimal | null;
};

export type ProductItem = ProductItems;
