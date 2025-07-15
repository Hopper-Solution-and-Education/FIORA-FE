import { prisma } from '@/config';
import {
  FaqDetailData,
  GetFaqDetailOptions,
  ReactionType,
  UpdateFaqRequest,
} from '../../domain/entities/models/faqs';

export interface IFaqRepository {
  getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetailData | null>;
  updateFaq(faqId: string, updateData: UpdateFaqRequest, userId: string): Promise<void>;
  deleteFaq(faqId: string): Promise<void>;
  getRelatedArticles(categoryId: string, currentFaqId: string, limit?: number): Promise<any[]>;
  incrementViewCount(faqId: string): Promise<void>;
}

/**
 * Repository for core FAQ CRUD operations
 */
export class FaqRepository implements IFaqRepository {
  async getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetailData | null> {
    try {
      const post = await prisma.post.findUnique({
        where: { id: faqId },
        include: {
          Reaction: true,
          Comment: {
            take: 100,
            orderBy: { createdAt: 'desc' },
            include: {
              User: true,
            },
          },
          PostCategory: true,
          User: true,
        },
      });

      if (!post) {
        return null;
      }

      // Build response data
      const responseData: FaqDetailData = {
        id: post.id,
        title: post.title,
        description: post.description || undefined,
        content: post.content,
        categoryId: post.PostCategory?.id || undefined,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt || undefined,
        User: post.User,
        Comment: post.Comment.map((comment) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          userId: comment.userId,
          User: comment.User,
        })),
        Reaction: post.Reaction.map((reaction) => ({
          id: reaction.id,
          reactionType: reaction.reactionType as ReactionType,
          userId: reaction.userId,
        })),
      };

      // Handle includes if provided
      if (options?.includes?.includes('related') && post.PostCategory?.id) {
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
            not: currentFaqId, // Exclude current FAQ
          },
          type: 'FAQ', // Only get FAQs
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
}
