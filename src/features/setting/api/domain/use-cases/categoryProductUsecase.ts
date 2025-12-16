import { PaginationResponse } from '@/shared/types';

import { Messages } from '@/shared/constants';
import { CategoryProducts, Prisma } from '@prisma/client';
import { categoryProductRepository } from '../../infrastructure/repositories/categoryProductRepository';
import { productRepository } from '../../infrastructure/repositories/productRepository';
import {
  CategoryProductCreation,
  ICategoryProductRepository,
} from '../../repositories/categoryProductRepository.interface';
import { IProductRepository } from '../../repositories/productRepository.interface';

class CategoryProductsUseCase {
  private categoryProductRepository: ICategoryProductRepository;
  private productRepository: IProductRepository;

  constructor(
    categoryProductRepository: ICategoryProductRepository,
    productRepository: IProductRepository,
  ) {
    this.categoryProductRepository = categoryProductRepository;
    this.productRepository = productRepository;
  }

  async getAllCategoryProducts(params: {
    userId: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<CategoryProducts>> {
    try {
      const { userId, page = 1, pageSize = 20 } = params;

      const categoryProductsAwaited = this.categoryProductRepository.findManyCategoryProducts(
        { userId },
        { skip: (page - 1) * pageSize, take: pageSize },
      );

      const countAwaited = this.categoryProductRepository.count({
        where: {
          userId,
        },
      });

      const [categoryProducts = [], count] = await Promise.all([
        categoryProductsAwaited,
        countAwaited,
      ]);

      const totalPage = Math.ceil(count / pageSize);

      return {
        data: categoryProducts,
        page,
        pageSize,
        totalPage,
      };
    } catch (error: any) {
      throw new Error('Failed to get all category products ' + error.message);
    }
  }

  async getCategoryProductById(params: { userId: string; id: string }): Promise<CategoryProducts> {
    try {
      const { userId, id } = params;

      const categoryProduct = await this.categoryProductRepository.findUniqueCategoryProduct({
        id,
        userId,
      });

      if (!categoryProduct) {
        throw new Error(Messages.CATEGORY_NOT_FOUND);
      }

      return categoryProduct;
    } catch (error: any) {
      console.log(error);
      throw new Error('Failed to get category product by id ' + error.message);
    }
  }

  async createCategoryProduct(data: CategoryProductCreation): Promise<CategoryProducts> {
    try {
      return await this.categoryProductRepository.createCategoryProduct({
        ...data,
        ...(data.tax_rate ? { tax_rate: new Prisma.Decimal(data.tax_rate) } : { tax_rate: 0 }), // Default tax rate to 0 if not provided
        createdBy: data.userId,
      });
    } catch (error: any) {
      throw new Error('Failed to create category product ' + error.message);
    }
  }

  async updateCategoryProduct(
    id: string,
    data: CategoryProductCreation,
  ): Promise<CategoryProducts> {
    try {
      const { userId, ...restData } = data;

      const foundCategoryProduct = await this.categoryProductRepository.findUniqueCategoryProduct({
        id,
        userId,
      });

      if (!foundCategoryProduct) {
        throw new Error(Messages.CATEGORY_PRODUCT_NOT_FOUND);
      }

      return await this.categoryProductRepository.updateCategoryProduct(
        { id, userId },
        {
          ...restData,
          ...(restData.tax_rate ? { tax_rate: new Prisma.Decimal(restData.tax_rate) } : {}),
          updatedBy: userId,
        },
      );
    } catch (error: any) {
      throw new Error('Failed to update category product ' + error.message);
    }
  }

  async deleteCategoryProduct(params: { userId: string; id: string }): Promise<CategoryProducts> {
    try {
      const { userId, id } = params;

      const foundCategoryProduct = await this.categoryProductRepository.findUniqueCategoryProduct({
        id,
        userId,
      });

      const foundProductMapped = await this.productRepository.findManyProducts({
        catId: id,
        userId,
      });

      if (foundProductMapped.length > 0) {
        throw new Error(Messages.CATEGORY_PRODUCT_STILL_HAS_PRODUCTS);
      }

      if (!foundCategoryProduct) {
        throw new Error(Messages.CATEGORY_PRODUCT_NOT_FOUND);
      }

      return await this.categoryProductRepository.deleteCategoryProduct({ id, userId });
    } catch (error: any) {
      throw new Error('Failed to delete category product ' + error.message);
    }
  }
}

// Export a single instance using the exported productRepository
export const categoryProductsUseCase = new CategoryProductsUseCase(
  categoryProductRepository,
  productRepository,
);
