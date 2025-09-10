import { Comment } from '@prisma/client';
import { IAccountRepository } from '../../domain/repository/accountRepository';
import { ICommentNewsRepository } from '../../domain/repository/commentNewsRepository';
import { accountRepository } from '../../infrashtructure/repositories/accountReposotory';
import { commentNewsRepository } from '../../infrashtructure/repositories/commentNewsRepository';
import {
  commentCreationNews,
  CommentResponse,
  commentUpdationNews,
  getCommentRequest,
} from '../../types/commentDTO';
class CommentUsecase {
  constructor(
    private commentNewsRepo: ICommentNewsRepository,
    private accountRepo: IAccountRepository,
  ) {}
  async getListByPostId(queryParam: getCommentRequest): Promise<CommentResponse[]> {
    const response = await this.commentNewsRepo.getCommentNews(queryParam);
    return response.map((result) => {
      const { postId, ...rest } = result;
      return {
        ...rest,
        newsId: postId,
      };
    });
  }

  async createComment(param: commentCreationNews): Promise<Comment> {
    if (param.replyComment) {
      param.content = `@${param.replyComment} ${param.content}`;
    }

    return this.commentNewsRepo.createCommentNews(param);
  }

  async updateComment(param: commentUpdationNews, commentId: string): Promise<Comment> {
    return this.commentNewsRepo.updateCommentNews(param, commentId);
  }

  async deleteComment(commentId: string): Promise<void> {
    this.commentNewsRepo.deleteCommentNews(commentId);
  }
}
export const commentUsecase = new CommentUsecase(commentNewsRepository, accountRepository);
