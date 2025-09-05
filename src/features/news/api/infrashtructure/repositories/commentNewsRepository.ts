import { prisma } from '@/config';
import { Comment } from '@prisma/client';
import { ICommentNewsRepository } from '../../domain/repository/commentNewsRepository';
import {
  commentCreationNews,
  CommentResponse,
  commentUpdationNews,
  getCommentRequest,
} from '../../types/commentDTO';

class CommentNewsRepository implements ICommentNewsRepository {
  async getCommentNews(queryParam: getCommentRequest): Promise<CommentResponse[]> {
    console.log(queryParam.postId);

    const skip = (queryParam.page - 1) * queryParam.limit;

    return prisma.comment.findMany({
      where: {
        postId: queryParam.postId,
      },
      skip: skip,
      orderBy: {
        [queryParam.orderBy]: queryParam.orderDirection,
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
  async createCommentNews(dto: commentCreationNews): Promise<Comment> {
    return prisma.comment.create({
      data: {
        content: dto.content,
        postId: dto.postId,
        userId: dto.userId,
        createdBy: dto.userId,
      },
    });
  }
  async updateCommentNews(dto: commentUpdationNews, commentId: string): Promise<Comment> {
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
