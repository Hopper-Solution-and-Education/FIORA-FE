import { Comment } from '@prisma/client';
import {
  CommentCreationNews,
  CommentResponseRepo,
  CommentUpdationNews,
  GetCommentRequest,
} from '../../types/commentDTO';

export interface ICommentNewsRepository {
  createCommentNews(dto: CommentCreationNews): Promise<Comment>;
  updateCommentNews(dto: CommentUpdationNews, commentId: string): Promise<Comment>;
  deleteCommentNews(commentId: string): Promise<void>;
  getCommentNews(queryParam: GetCommentRequest): Promise<CommentResponseRepo[]>;
}
