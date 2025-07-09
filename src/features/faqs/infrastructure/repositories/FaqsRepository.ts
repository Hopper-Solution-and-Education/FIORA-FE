import { prisma } from '@/config';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';
import {
  FaqsRowRaw,
  FaqsImportResult,
  PostType,
  FaqsListResponse,
  Faq,
  FaqsCategoriesResponse,
  FaqsListCategoriesResponse,
  CategoryWithFaqs,
  FaqsListQueryParams,
} from '../../domain/entities/models/faqs';
import { Prisma } from '@prisma/client';
import { generateUrlHtml } from '../../utils/contentUtils';
import { FAQ_LIST_CONSTANTS } from '../../constants';

export class FaqsRepository implements IFaqsRepository {
  async importFaqs(validatedRows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult> {
    if (validatedRows.length === 0) {
      return {
        successful: 0,
        totalProcessed: 0,
        failed: 0,
      };
    }

    try {
      const formattedRecords = await Promise.all(
        validatedRows.map(async (record) => {
          const categoryId = await this.findOrCreateCategory(record.category, record.type, userId);

          if (!categoryId) {
            return null;
          }

          // Generate HTML content based on URL and urlType
          let content = record.content || '';
          if (record.url && record.typeOfUrl) {
            const urlHtml = generateUrlHtml(record.url, record.typeOfUrl);
            content = content ? `${content}\n\n${urlHtml}` : urlHtml;
          }

          return {
            categoryId,
            userId,
            createdBy: userId,
            title: record.title || '',
            description: record.description || '',
            content,
            type: record.type || PostType.FAQ,
          };
        }),
      );

      const validFormattedRecords = formattedRecords.filter((record) => record !== null);

      const result = await prisma.post.createMany({
        data: validFormattedRecords,
        skipDuplicates: true,
      });

      return {
        successful: result.count,
        totalProcessed: validatedRows.length,
        failed: validatedRows.length - result.count,
      };
    } catch (error) {
      console.error('Error importing FAQs:', error);
      return {
        successful: 0,
        totalProcessed: validatedRows.length,
        failed: validatedRows.length,
      };
    }
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

  async getFaqsList(params: FaqsListQueryParams): Promise<FaqsListResponse> {
    const {
      page = 1,
      pageSize = 10,
      filters = { search: '', categories: [] },
      orderBy = 'views',
      orderDirection = 'desc',
      limit,
    } = params;

    const skip = (page - 1) * pageSize;

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

      // Get total count for pagination
      // const totalCount = await prisma.post.count({ where: whereCondition });
      // const totalPages = Math.ceil(totalCount / (pageSize || 10));

      // Get results
      const posts = await prisma.post.findMany({
        where: whereCondition,
        include: {
          PostCategory: true,
        },
        skip: limit ? 0 : skip,
        take: limit ? limit : undefined,
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
        currentPage: page,
        pageSize: pageSize || 10,
        // totalCount,
        // totalPages,
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
        type: 'FAQ',
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

  async checkExistingTitles(titles: string[], userId: string): Promise<string[]> {
    try {
      const existingPosts = await prisma.post.findMany({
        where: {
          userId,
          type: PostType.FAQ,
          title: {
            in: titles,
          },
        },
        select: {
          title: true,
        },
      });

      return existingPosts.map((post) => post.title);
    } catch (error) {
      console.error('Error checking existing titles:', error);
      return [];
    }
  }
}
