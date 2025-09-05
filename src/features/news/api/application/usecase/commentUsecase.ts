import { Comment } from '@prisma/client';
import { ICommentNewsRepository } from '../../domain/repository/commentNewsRepository';
import { commentNewsRepository } from '../../infrashtructure/repositories/commentNewsRepository';
import {
  commentCreationNews,
  CommentResponse,
  commentUpdationNews,
  getCommentRequest,
} from '../../types/commentDTO';
class CommentUsecase {
  constructor(private commentNewsRepo: ICommentNewsRepository) {}
  async getListByPostId(queryParam: getCommentRequest): Promise<CommentResponse[]> {
    return await this.commentNewsRepo.getCommentNews(queryParam);
  }

  async createComment(param: commentCreationNews): Promise<Comment> {
    if (param.repLyComment) {
      param.content = `@${param.repLyComment} ${param.content}`;
    }

    return this.commentNewsRepo.createCommentNews(param);
  }

  async updateComment(param: commentUpdationNews, postId: string): Promise<Comment> {
    return this.commentNewsRepo.updateCommentNews(param, postId);
  }

  async deleteComment(commentId: string): Promise<void> {
    this.commentNewsRepo.deleteCommentNews(commentId);
  }
}
export const commentUsecase = new CommentUsecase(commentNewsRepository);
