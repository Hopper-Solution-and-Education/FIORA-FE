import { prisma } from '@/config';
import { FAQ_LIST_CONSTANTS } from '../../constants';
import {
  FaqCategory,
  FaqsCategoriesResponse,
  FaqsCategoriesWithPostParams,
  FaqsCategoriesWithPostResponse,
  PostType,
} from '../../domain/entities/models/faqs';
import { IFaqCategoryRepository } from '../../domain/repositories';

export class FaqCategoryRepository implements IFaqCategoryRepository {
  async getFaqCategories(): Promise<FaqsCategoriesResponse[]> {
    return await prisma.postCategory.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createFaqCategory(
    categoryName: string,
    type: string,
    userId: string,
  ): Promise<FaqCategory> {
    const category = await prisma.postCategory.create({
      data: { name: categoryName, type: type as PostType, createdBy: userId },
    });
    return category as FaqCategory;
  }

  async findOrCreateCategory(
    categoryName: string,
    type: string,
    userId: string,
  ): Promise<string | null> {
    try {
      let category = await prisma.postCategory.findFirst({
        where: {
          name: categoryName,
        },
      });

      if (!category) {
        category = await prisma.postCategory.create({
          data: {
            name: categoryName,
            type: type as PostType,
            createdBy: userId,
          },
        });
      }

      return category?.id || null;
    } catch (error) {
      console.error('Error finding or creating category:', error);
      return null;
    }
  }

  async getFaqCategoriesWithPost(
    params: FaqsCategoriesWithPostParams,
  ): Promise<FaqsCategoriesWithPostResponse[]> {
    const categories = await prisma.postCategory.findMany({
      where: {
        type: params.type || PostType.FAQ,
      },
      select: {
        id: true,
        name: true,
        Post: {
          take: params.limit || FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY,
        },
      },
    });

    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      faqs: category.Post,
    }));
    return formattedCategories as unknown as FaqsCategoriesWithPostResponse[];
  }
}

export const faqCategoryRepository = new FaqCategoryRepository();
