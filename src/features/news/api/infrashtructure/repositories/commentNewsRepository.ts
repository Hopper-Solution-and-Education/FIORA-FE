import { prisma } from '@/config';
import { Comment } from '@prisma/client';
import { ICommentNewsRepository } from '../../domain/repository/commentNewsRepository';
import {
  CommentCreationNews,
  CommentResponseRepo,
  CommentUpdationNews,
  GetCommentRequest,
} from '../../types/commentDTO';

class CommentNewsRepository implements ICommentNewsRepository {
  async getCommentNews(queryParam: GetCommentRequest): Promise<CommentResponseRepo[]> {
    const skip = (Number(queryParam.page) - 1) * Number(queryParam.limit);

    return prisma.comment.findMany({
      where: {
        postId: queryParam.newsId,
      },
      skip: skip,
      orderBy: {
        [queryParam.orderBy as string]: queryParam.orderDirection,
      },
      select: {
        id: true,
        content: true,
        postId: true,
        createdAt: true,
        User: {
          select: {
            id: true,
            email: true,
            avatarId: true,
          },
        },
      },
    });
  }
  async deleteCommentNews(commentId: string): Promise<void> {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
  async createCommentNews(dto: CommentCreationNews): Promise<Comment> {
    return prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.newsId,
        userId: dto.userId,
        createdBy: dto.userId,
      },
    });
  }
  async updateCommentNews(dto: CommentUpdationNews, commentId: string): Promise<Comment> {
    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: dto.content,
        userId: dto.userId,
        updatedBy: dto.userId,
      },
    });
  }
}

export const commentNewsRepository = new CommentNewsRepository();
