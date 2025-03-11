import { Prisma, Product } from '@prisma/client';
import prisma from '@/infrastructure/database/prisma';
import { IProductRepository } from '../../domain/repositories/productRepository.interface';

class ProductRepository implements IProductRepository {
  async find(options: Prisma.ProductFindFirstArgs): Promise<Product | null> {
    return prisma.product.findFirst(options);
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(options: Prisma.ProductUpdateArgs): Promise<Product> {
    return prisma.product.update(options);
  }

  async delete(options: Prisma.ProductDeleteArgs): Promise<Product> {
    return prisma.product.delete(options);
  }

  async findMany(options: Prisma.ProductFindManyArgs): Promise<Product[] | []> {
    return prisma.product.findMany(options);
  }
}

export const productRepository = new ProductRepository();
