import { prisma } from '@/config';
import { CreateCommentRequest, FaqComment } from '../../domain/entities/models/faqs';
import { IFaqCommentRepository } from '../../domain/repositories';

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
      // If there is a reply to username, add prefix to content
      const finalContent = request.replyToUsername
        ? `@${request.replyToUsername} ${request.content}`
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

  async getFaqComments(faqId: string): Promise<FaqComment[]> {
    const comments = await prisma.comment.findMany({
      where: { postId: faqId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
      User: comment.User,
    }));
  }
}

export const faqCommentRepository = new FaqCommentRepository();
