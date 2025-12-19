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
// TODO: Remove this interface after complete migration and remove prisma schema
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
  price: number;
  taxRate: number | null;
  type: ProductType;
  catId: string | null;
  currency: string | null;
  currencyId: string | null;
  baseCurrency: string | null;
  baseAmount: number | null;
};

export type ProductItem = ProductItems;
