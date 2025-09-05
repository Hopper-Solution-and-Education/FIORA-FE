import { Comment } from '@prisma/client';
import {
  commentCreationNews,
  CommentResponse,
  commentUpdationNews,
  getCommentRequest,
} from '../../types/commentDTO';

export interface ICommentNewsRepository {
  createCommentNews(dto: commentCreationNews): Promise<Comment>;
  updateCommentNews(dto: commentUpdationNews, commentId: string): Promise<Comment>;
  deleteCommentNews(commentId: string): Promise<void>;
  getCommentNews(queryParam: getCommentRequest): Promise<CommentResponse[]>;
}
