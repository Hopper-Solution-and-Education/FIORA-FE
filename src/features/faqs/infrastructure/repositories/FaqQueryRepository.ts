import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import { FAQ_LIST_CONSTANTS } from '../../constants';
import {
  CategoryWithFaqs,
  Faq,
  FaqsCategoriesResponse,
  FaqsListCategoriesResponse,
  FaqsListQueryParams,
  FaqsListResponse,
  PostType,
} from '../../domain/entities/models/faqs';

export interface IFaqQueryRepository {
  getFaqsList(params: FaqsListQueryParams): Promise<FaqsListResponse>;
  getFaqsListByCategories(params: FaqsListQueryParams): Promise<FaqsListCategoriesResponse>;
  getFaqCategories(): Promise<FaqsCategoriesResponse[]>;
}

/**
 * Repository for FAQ list and search operations
 */
export class FaqQueryRepository implements IFaqQueryRepository {
  async getFaqsList(params: FaqsListQueryParams): Promise<FaqsListResponse> {
    const {
      page,
      limit,
      filters = { search: '', categories: [] },
      orderBy = 'views',
      orderDirection = 'desc',
    } = params;

    const skip = page && limit ? (page - 1) * limit : 0;

    try {
      // Build where clause for filtering
      const whereCondition: Prisma.PostWhereInput = {
        type: PostType.FAQ,
      };

      // Add category filter if provided
      if (filters.categories && filters.categories.length > 0) {
        whereCondition.PostCategory = {
          id: { in: filters.categories },
        };
      }

      // Add search filter if provided
      if (filters.search) {
        whereCondition.OR = [
          { title: { contains: filters.search, mode: 'insensitive' as Prisma.QueryMode } },
          // { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          // { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ];
      }

      // Get results
      const posts = await prisma.post.findMany({
        where: whereCondition,
        include: {
          PostCategory: true,
        },
        skip: skip,
        take: limit || undefined,
        orderBy: { [orderBy]: orderDirection },
      });

      // Map to Faq model
      const faqs: Faq[] = posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description || '',
        content: post.content,
        category: post.PostCategory.name,
        type: post.type as PostType,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt || post.createdAt,
      }));

      return {
        faqs,
        currentPage: page || undefined,
        limit: limit || undefined,
      };
    } catch (error) {
      console.error('Error getting FAQs list:', error);
      throw error;
    }
  }

  async getFaqsListByCategories(params: FaqsListQueryParams): Promise<FaqsListCategoriesResponse> {
    const { limit = FAQ_LIST_CONSTANTS.FAQS_PER_CATEGORY } = params;

    try {
      // Build base where condition
      const baseWhereCondition: Prisma.PostWhereInput = {
        type: PostType.FAQ,
      };

      // Get all categories with their post counts
      const categories = await prisma.postCategory.findMany({
        where: {
          Post: {
            some: baseWhereCondition,
          },
        },
        include: {
          Post: {
            where: baseWhereCondition,
            take: limit,
            orderBy: {
              updatedAt: 'desc',
            },
          },
          _count: {
            select: {
              Post: {
                where: baseWhereCondition,
              },
            },
          },
        },
      });

      // Transform to CategoryWithFaqs format
      const categoriesData: CategoryWithFaqs[] = categories.map((category) => ({
        categoryId: category.id,
        categoryName: category.name,
        totalFaqs: category._count.Post,
        faqs: category.Post.map((post) => ({
          id: post.id,
          title: post.title,
          description: post.description || '',
          content: post.content,
          category: category.name,
          type: post.type as PostType,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt || post.createdAt,
        })),
      }));

      return {
        categoriesData,
      };
    } catch (error) {
      console.error('Error getting FAQs by categories:', error);
      throw error;
    }
  }

  async getFaqCategories(): Promise<FaqsCategoriesResponse[]> {
    try {
      const categories = await prisma.postCategory.findMany({
        where: {
          type: PostType.FAQ,
        },
        distinct: ['name'],
        select: {
          name: true,
          id: true,
        },
      });

      return categories;
    } catch (error) {
      console.error('Error getting FAQ categories:', error);
      return [];
    }
  }
}
