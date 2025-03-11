import { Prisma, Product } from '@prisma/client';

export interface IProductRepository {
  find(options: Prisma.ProductFindFirstArgs): Promise<Product | null>;
  create(data: Prisma.ProductCreateInput): Promise<Product>;
  update(options: Prisma.ProductUpdateArgs): Promise<Product>;
  delete(options: Prisma.ProductDeleteArgs): Promise<Product>;
  findMany(options: Prisma.ProductFindManyArgs): Promise<Product[] | []>;
}
