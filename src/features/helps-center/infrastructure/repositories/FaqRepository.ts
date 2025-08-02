import { prisma } from '@/config';
import { FAQ_LIST_CONSTANTS } from '@/features/helps-center/constants';
import { Prisma } from '@prisma/client';
import {
  CreateFaqRequest,
  FaqDetail,
  FaqListResponse,
  FaqsListQueryParams,
  GetFaqDetailOptions,
  Post,
  PostType,
  UpdateFaqRequest,
} from '../../domain/entities/models/faqs';
import { IFaqRepository } from '../../domain/repositories/IFaqRepository';

/**
 * Repository for core FAQ CRUD operations
 */
export class FaqRepository implements IFaqRepository {
  async getFaqList(params: FaqsListQueryParams): Promise<FaqListResponse> {
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
      const faqs: Post[] = posts.map((post) => ({
        id: post.id,
        title: post.title,
        description: post.description || '',
        content: post.content,
        categoryId: post.categoryId,
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

  async getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetail | null> {
    try {
      const post = await prisma.post.findUnique({
        where: { id: faqId },
        include: {
          PostCategory: true,
          User: true,
        },
      });

      if (!post) {
        return null;
      }

      // Build response data
      const responseData: FaqDetail = {
        id: post.id,
        title: post.title,
        description: post.description || '',
        type: post.type as PostType,
        content: post.content,
        categoryId: post.categoryId,
        createdAt: post.createdAt,
        User: post.User,
      };

      // Handle includes if provided
      if (
        options?.includes?.includes(FAQ_LIST_CONSTANTS.GET_FAQ_DETAIL_INCLUDE.related) &&
        post.PostCategory?.id
      ) {
        responseData.relatedArticles = await this.getRelatedArticles(post.PostCategory.id, faqId);
      }

      return responseData;
    } catch (error) {
      console.error('Error getting FAQ detail:', error);
      throw error;
    }
  }

  async updateFaq(faqId: string, updateData: UpdateFaqRequest, userId: string): Promise<void> {
    try {
      await prisma.post.update({
        where: { id: faqId },
        data: {
          title: updateData.title,
          description: updateData.description,
          content: updateData.content,
          updatedBy: userId,
          PostCategory: {
            connect: { id: updateData.categoryId },
          },
        },
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  async deleteFaq(faqId: string): Promise<void> {
    try {
      await prisma.post.delete({
        where: { id: faqId },
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error;
    }
  }

  async getRelatedArticles(
    categoryId: string,
    currentFaqId: string,
    limit: number = 5,
  ): Promise<any[]> {
    try {
      const relatedFaqs = await prisma.post.findMany({
        where: {
          PostCategory: {
            id: categoryId,
          },
          id: {
            not: currentFaqId,
          },
          type: PostType.FAQ,
        },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          PostCategory: {
            select: {
              name: true,
            },
          },
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return relatedFaqs.map((faq) => ({
        id: faq.id,
        title: faq.title,
        description: faq.description || '',
        category: faq.PostCategory?.name || '',
        createdAt: faq.createdAt,
      }));
    } catch (error) {
      console.error('Error getting related articles:', error);
      return [];
    }
  }

  async incrementViewCount(faqId: string): Promise<void> {
    try {
      await prisma.post.update({
        where: { id: faqId },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  }

  async createFaq(params: CreateFaqRequest): Promise<Post> {
    try {
      const { title, description, content, categoryId, userId } = params;
      const faq = await prisma.post.create({
        data: {
          title,
          description,
          content,
          type: PostType.FAQ,
          createdBy: userId,
          User: {
            connect: { id: userId },
          },
          PostCategory: {
            connect: { id: categoryId },
          },
        } as Prisma.PostCreateInput,
      });
      return {
        id: faq.id,
        title: faq.title,
        description: faq.description || '',
        content: faq.content,
        createdAt: faq.createdAt,
        categoryId: faq.categoryId,
        type: faq.type as PostType,
      };
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
  }
}

export const faqRepository = new FaqRepository();
