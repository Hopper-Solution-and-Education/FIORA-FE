import { Product, ProductType } from '@prisma/client';
import {
  IProductRepository,
  ProductCreation,
  ProductUpdate,
} from '@/features/setting/domain/repositories/productRepository.interface';
import { productRepository } from '@/features/setting/infrastructure/repositories/productRepository';
import { JsonArray } from '@prisma/client/runtime/library';
import { ICategoryRepository } from '../../domain/repositories/categoryRepository.interface';
import { categoryRepository } from '../../infrastructure/repositories/categoryRepository';
import { PaginationResponse } from '@/shared/types/Common.types';

class ProductUseCase {
  private productRepository: IProductRepository;
  private categoryRepository: ICategoryRepository;

  constructor(productRepository: IProductRepository, categoryRepository: ICategoryRepository) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  async getAllProducts(params: {
    userId: string;
    page?: number;
    pageSize?: number;
  }): Promise<PaginationResponse<Product>> {
    try {
      const { userId, page = 1, pageSize = 20 } = params;
      const productsAwaited = this.productRepository.findManyProducts(
        { userId },
        { skip: (page - 1) * pageSize, take: pageSize },
      );

      const countAwaited = this.productRepository.count({
        where: {
          userId,
        },
      });

      const [products = [], count] = await Promise.all([productsAwaited, countAwaited]);

      const totalPage = Math.ceil(count / pageSize);

      return {
        data: products,
        page,
        pageSize,
        totalPage,
      };
    } catch (error: any) {
      throw new Error('Failed to get all products ', error.message);
    }
  }

  async getProductsByType(userId: string, type: ProductType): Promise<Product[]> {
    try {
      const products = await this.productRepository.groupBy({
        by: ['type'],
        where: {
          AND: {
            userId,
            type,
          },
        },
      });

      return products;
    } catch (error: any) {
      throw new Error('Failed to get products by type', error.message);
    }
  }

  async getProductById(params: { userId: string; id: string }) {
    const { userId, id } = params;
    try {
      const product = await this.productRepository.findUniqueProduct({
        id,
        userId,
      });

      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error: any) {
      throw new Error('Failed to get product by ID');
    }
  }

  async createProduct(params: ProductCreation) {
    try {
      const {
        userId,
        icon,
        name,
        description = '',
        tax_rate = 0,
        price,
        type,
        category_id,
        items,
      } = params;
      // checked whether the category exists

      const category = await this.categoryRepository.findCategoryById(category_id);
      if (!category) {
        throw new Error('Category not found');
      }

      // validate items input
      let itemsJSON = [] as JsonArray;

      if (Array.isArray(items)) {
        // convert into JSON Array
        itemsJSON = items.map((item) => JSON.stringify(item));
      }

      const product = await this.productRepository.createProduct({
        userId,
        icon,
        name,
        taxRate: tax_rate ?? category.tax_rate, // if tax_rate is not provided, use the category tax_rate
        price,
        type,
        catId: category_id,
        createdBy: userId,
        ...(description && { description }),
        ...(itemsJSON.length > 0 && { items: itemsJSON }), // if itemsJSON is not empty, add items
      });

      if (!product) {
        throw new Error('Failed to create new product & service');
      }

      return product;
    } catch (error: any) {
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(params: ProductUpdate & { id: string }) {
    const {
      id,
      userId,
      icon,
      name,
      description = '',
      tax_rate = 0,
      price,
      type,
      category_id,
      items,
    } = params;
    let category = null;

    if (category_id) {
      category = await this.categoryRepository.findCategoryById(category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    if (!id) {
      throw new Error('Product ID is required');
    }

    const foundProduct = await this.productRepository.findUniqueProduct({ id });
    if (!foundProduct) {
      throw new Error('Product not found');
    }

    // validate items input
    let itemsJSON = [] as JsonArray;
    if (Array.isArray(items)) {
      // convert into JSON Array
      itemsJSON = items.map((item) => JSON.stringify(item));
    }
    // ... rest of the code remains the same ...
    const updatedProduct = await this.productRepository.updateProduct(
      {
        id,
        userId,
      },
      {
        ...(category && { catId: category_id }),
        ...(icon && { icon }),
        ...(name && { name }),
        ...(description && { description }),
        ...(tax_rate && { taxRate: tax_rate }),
        ...(price && { price }),
        ...(type && { type }),
        ...(itemsJSON.length > 0 && { items: itemsJSON }),
        updatedBy: userId,
      },
    );

    if (!updatedProduct) {
      throw new Error('Failed to update product');
    }
    return updatedProduct;
  }

  async deleteProduct(params: { userId: string; id: string }) {
    const { userId, id } = params;

    if (!id) {
      throw new Error('Product ID is required');
    }

    const foundProduct = await this.productRepository.findUniqueProduct({ id, userId });
    if (!foundProduct) {
      throw new Error('Product not found');
    }

    const deletedProduct = await this.productRepository.deleteProduct({ id });
    if (!deletedProduct) {
      throw new Error('Failed to delete product');
    }

    return deletedProduct;
  }
}

// Export a single instance using the exported productRepository
export const productUseCase = new ProductUseCase(productRepository, categoryRepository);
