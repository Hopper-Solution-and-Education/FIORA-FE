import { Prisma, Product, ProductType } from '@prisma/client';
import { JsonArray, JsonObject } from '@prisma/client/runtime/library';

export declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface IProductRepository {
  createProduct(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;
  findUniqueProduct(
    where: Prisma.ProductWhereUniqueInput,
    options?: Prisma.ProductFindFirstArgs,
  ): Promise<Prisma.ProductGetPayload<{ include: { transactions: true } }> | null | null>;
  findManyProducts(
    where: Prisma.ProductWhereInput,
    options: Prisma.ProductFindManyArgs,
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
}

export type Items = {
  name: string;
  description: string;
};
