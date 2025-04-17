import { Prisma, CategoryProducts } from '@prisma/client';
import { JsonArray, JsonObject } from '@prisma/client/runtime/library';

export declare type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface ICategoryProductRepository {
  createCategoryProduct(
    data: Prisma.CategoryProductsUncheckedCreateInput,
    options?: Prisma.CategoryProductsCreateArgs,
  ): Promise<CategoryProducts>;
  findUniqueCategoryProduct(
    where: Prisma.CategoryProductsWhereUniqueInput,
    options?: Prisma.CategoryProductsFindUniqueArgs,
  ): Promise<CategoryProducts | null>;
  findManyCategoryProducts(
    where: Prisma.CategoryProductsWhereInput,
    options: Prisma.CategoryProductsFindManyArgs,
  ): Promise<CategoryProducts[]>;
  updateCategoryProduct(
    where: Prisma.CategoryProductsWhereUniqueInput,
    data: Prisma.CategoryProductsUpdateInput,
  ): Promise<CategoryProducts>;
  updateManyCategoryProduct(
    where: Prisma.CategoryProductsWhereInput,
    data: Prisma.CategoryProductsUpdateManyMutationInput,
  ): Promise<Prisma.BatchPayload>;
  deleteCategoryProduct(where: Prisma.CategoryProductsWhereUniqueInput): Promise<CategoryProducts>;
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
