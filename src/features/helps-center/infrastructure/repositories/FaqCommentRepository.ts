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
            avatarId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const avatarIds: string[] = comments
      .filter(
        (comment) => typeof comment.User.avatarId === 'string' && comment.User.avatarId.length > 0,
      )
      .map((comment) => comment.User.avatarId!);

    const avatars = await prisma.attachment.findMany({
      where: { id: { in: avatarIds } },
      select: { id: true, url: true },
    });

    const avatarMap = new Map(avatars.map((a) => [a.id, a.url]));

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      userId: comment.userId,
      User: {
        id: comment.User.id,
        name: comment.User.name,
        email: comment.User.email,
        image: avatarMap.get(comment.User.avatarId!) || '',
      },
    }));
  }
}

export const faqCommentRepository = new FaqCommentRepository();
