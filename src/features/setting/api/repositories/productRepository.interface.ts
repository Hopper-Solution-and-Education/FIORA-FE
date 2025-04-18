import { Currency, Prisma, Product, ProductType } from '@prisma/client';
import { JsonArray, JsonObject } from '@prisma/client/runtime/library';

export declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface IProductRepository {
  createProduct(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  findProductById(
    where: Prisma.ProductWhereInput,
    options?: Prisma.ProductFindFirstArgs,
  ): Promise<Product | null>;
  findManyProducts(
    where: Prisma.ProductWhereInput,
    options?: Prisma.ProductFindManyArgs,
  ): Promise<Product[]>;
  updateProduct(
    where: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ): Promise<Product>;
  deleteProduct(where: Prisma.ProductWhereUniqueInput): Promise<Product>;
  aggregate(options: Prisma.ProductAggregateArgs): Promise<any>;
  groupBy(options: Prisma.ProductGroupByArgs): Promise<any>;
  count(options: Prisma.ProductCountArgs): Promise<number>;
}

export interface ProductCreation {
  userId: string;
  icon: string;
  name: string;
  description: string;
  tax_rate: number;
  price: number;
  type: ProductType;
  category_id: string;
  items?: Items[] | null;
  currency?: Currency;
}

export interface ProductUpdate {
  userId: string;
  id: string;
  icon?: string;
  name?: string;
  description?: string;
  tax_rate?: number;
  price?: number;
  type?: ProductType;
  category_id?: string;
  items?: Items[] | null;
  currency?: Currency;
}

export type Items = {
  id?: string;
  icon: string;
  name: string;
  description: string;
};
