import { Comment } from '@prisma/client';
import { ICommentNewsRepository } from '../../domain/repository/commentNewsRepository';
import { accountRepository } from '../../infrashtructure/repositories/accountReposotory';
import { commentNewsRepository } from '../../infrashtructure/repositories/commentNewsRepository';
import {
  CommentCreationNews,
  CommentResponse,
  CommentUpdationNews,
  GetCommentRequest,
} from '../../types/commentDTO';
class CommentUsecase {
  constructor(private commentNewsRepo: ICommentNewsRepository) {}
  async getListByPostId(queryParam: GetCommentRequest): Promise<CommentResponse[]> {
    const response = await this.commentNewsRepo.getCommentNews(queryParam);

    // Get all unique avatarIds that are not null
    const avatarIds = Array.from(
      new Set(
        response
          .map((result) => result.User?.avatarId)
          .filter((id): id is string => id !== null && id !== undefined),
      ),
    );

    // Fetch avatars in one query if there are any avatarIds
    const avatars = avatarIds.length > 0 ? await accountRepository.getAvatarByIds(avatarIds) : [];

    // Create a map
    const avatarMap = new Map(avatars.map((avatar) => [avatar.id, avatar.url]));

    return response.map((result) => {
      const { postId, ...rest } = result;
      return {
        ...rest,
        newsId: postId,
        User: {
          id: result.User.id,
          email: result.User.email,
          image: result.User.avatarId ? avatarMap.get(result.User.avatarId) || null : null,
        },
      };
    });
  }

  async createComment(param: CommentCreationNews): Promise<Comment> {
    if (param.replyComment) {
      param.content = `@${param.replyComment} ${param.content}`;
    }

    return this.commentNewsRepo.createCommentNews(param);
  }

  async updateComment(param: CommentUpdationNews, commentId: string): Promise<Comment> {
    return this.commentNewsRepo.updateCommentNews(param, commentId);
  }

  async deleteComment(commentId: string): Promise<void> {
    this.commentNewsRepo.deleteCommentNews(commentId);
  }
}
export const commentUsecase = new CommentUsecase(commentNewsRepository);
