import { prisma } from '@/config';
import { Comment } from '@prisma/client';
import { ICommentNewsRepository } from '../../domain/repository/commentNewsRepository';
import { commentCreationNews, commentUpdationNews } from '../../types/commentDTO';

class CommentNewsRepository implements ICommentNewsRepository {
  getCommentNews(postId: string): Promise<Comment[]> {
    console.log(postId);
    throw new Error('Method not implemented.');
  }
  async deleteCommentNews(commentId: string): Promise<void> {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
  async createCommentNews(dto: commentCreationNews): Promise<Comment> {
    const result = await prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        userId: dto.userId,
        createdBy: dto.userId,
      },
    });

    return result;
  }
  async updateCommentNews(dto: commentUpdationNews, commentId: string): Promise<Comment> {
    const result = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: dto.content,
        postId: dto.postId,
        userId: dto.userId,
        createdBy: dto.userId,
      },
    });

    return result;
  }
}

export const commentNewsRepository = new CommentNewsRepository();
