import { Prisma, CategoryProducts } from '@prisma/client';
import { JsonArray, JsonObject } from '@prisma/client/runtime/library';

export declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface ICategoryProductRepository {
  createCategoryProduct(
    data: Prisma.CategoryProductsUncheckedCreateInput,
  ): Promise<CategoryProducts>;
  findUniqueCategoryProduct(
    where: Prisma.CategoryProductsWhereUniqueInput,
  ): Promise<CategoryProducts | null>;
  findManyCategoryProducts(
    where: Prisma.CategoryProductsWhereInput,
    options: Prisma.CategoryProductsFindManyArgs,
  ): Promise<CategoryProducts[]>;
  // updateCategoryProduct(
  //   where: Prisma.CategoryProductsWhereUniqueInput,
  //   data: Prisma.CategoryProductsUpdateInput,
  // ): Promise<CategoryProducts>;
  // deleteCategoryProduct(where: Prisma.CategoryProductsWhereUniqueInput): Promise<CategoryProducts>;
  aggregate(options: Prisma.CategoryProductsAggregateArgs): Promise<any>;
  // groupBy(options: Prisma.CategoryProductsGroupByArgs): Promise<any>;
  count(options: Prisma.CategoryProductsCountArgs): Promise<number>;
}

export interface CategoryProductCreation {
  userId: string;
  icon: string;
  name: string;
  description: string;
  tax_rate: number;
}

export interface CategoryProductUpdate {
  userId: string;
  id: string;
  icon?: string;
  name?: string;
  description?: string;
  tax_rate?: number;
}

export type Items = {
  name: string;
  description: string;
};
