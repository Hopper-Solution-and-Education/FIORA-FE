import { Comment } from '@prisma/client';
import { commentCreationNews, commentUpdationNews } from '../../types/commentDTO';

export interface ICommentNewsRepository {
  createCommentNews(dto: commentCreationNews): Promise<Comment>;
  updateCommentNews(dto: commentUpdationNews, commentId: string): Promise<Comment>;
  deleteCommentNews(commentId: string): Promise<void>;
  getCommentNews(postId: string): Promise<Comment[]>;
}
