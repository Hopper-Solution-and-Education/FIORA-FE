import { prisma } from '@/config';
import { CreateCommentRequest, FaqComment } from '../../domain/entities/models/faqs';

export interface IFaqCommentRepository {
  createComment(faqId: string, userId: string, request: CreateCommentRequest): Promise<FaqComment>;
  deleteComment(commentId: string): Promise<void>;
}

/**
 * Repository for FAQ comment operations
 */
export class FaqCommentRepository implements IFaqCommentRepository {
  async createComment(
    faqId: string,
    userId: string,
    request: CreateCommentRequest,
  ): Promise<FaqComment> {
    try {
      // Nếu có người được reply thì gắn prefix vào content
      const finalContent = request.replyToUsername
        ? `@${request.replyToUsername}: ${request.content}`
        : request.content;

      const comment = await prisma.comment.create({
        data: {
          postId: faqId,
          userId,
          content: finalContent,
          createdBy: userId,
          updatedAt: new Date(),
        },
        include: {
          User: true,
        },
      });

      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        userId: comment.userId,
        User: comment.User,
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}
