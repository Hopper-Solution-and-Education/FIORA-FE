import { prisma } from '@/config';
import {
  IFaqsRepository,
  FaqsQueryParams,
  CategoryWithFaqs,
  FaqsListCategoriesResponse,
} from '../../domain/repositories/IFaqsRepository';
import {
  FaqsRowRaw,
  FaqsImportResult,
  PostType,
  FaqsListResponse,
  Faq,
} from '../../domain/entities/models/faqs';
import { Prisma } from '@prisma/client';
import { generateUrlHtml } from '../../utils/contentUtils';

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

  async getFaqsList(params: FaqsQueryParams, userId: string): Promise<FaqsListResponse> {
    const {
      page = 1,
      pageSize = 10,
      category,
      type,
      search,
      orderBy = 'updatedAt',
      limit,
    } = params;

    const skip = (page - 1) * pageSize;
    const take = limit || pageSize;

    try {
      // Build where clause for filtering
      const whereCondition: Prisma.PostWhereInput = {
        userId,
        type: type ? (type as any) : 'FAQ',
      };

      // Add category filter if provided
      if (category) {
        if (Array.isArray(category)) {
          whereCondition.PostCategory = {
            id: { in: category },
          };
        } else {
          whereCondition.PostCategory = {
            name: category,
          };
        }
      }

      // Add search filter if provided
      if (search) {
        whereCondition.OR = [
          { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ];
      }

      // Build order by clause
      let orderByClause: Prisma.PostOrderByWithRelationInput = {
        updatedAt: 'desc',
      };

      if (orderBy === 'views') {
        // For most viewed, we'll order by a views field (you may need to add this to your schema)
        // For now, using createdAt as a placeholder
        orderByClause = { createdAt: 'desc' };
      } else if (orderBy === 'createdAt') {
        orderByClause = { createdAt: 'desc' };
      }

      // Get total count for pagination
      const totalCount = await prisma.post.count({ where: whereCondition });
      const totalPages = Math.ceil(totalCount / (pageSize || 10));

      // Get results
      const posts = await prisma.post.findMany({
        where: whereCondition,
        include: {
          PostCategory: true,
        },
        skip: limit ? 0 : skip, // If limit is specified, don't skip
        take,
        orderBy: orderByClause,
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
        totalCount,
        currentPage: page,
        pageSize: pageSize || 10,
        totalPages,
      };
    } catch (error) {
      console.error('Error getting FAQs list:', error);
      throw error;
    }
  }

  async getFaqsListByCategories(
    params: FaqsQueryParams,
    userId: string,
  ): Promise<FaqsListCategoriesResponse> {
    const { search, limit = 4 } = params;

    try {
      // Build base where condition
      const baseWhereCondition: Prisma.PostWhereInput = {
        userId,
        type: 'FAQ',
      };

      // Add search filter if provided
      if (search) {
        baseWhereCondition.OR = [
          { title: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { content: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ];
      }

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

  async getFaqCategories(): Promise<string[]> {
    try {
      const categories = await prisma.postCategory.findMany({
        where: {
          type: PostType.FAQ,
        },
        distinct: ['name'],
        select: {
          name: true,
        },
      });

      return categories.map((category) => category.name);
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
