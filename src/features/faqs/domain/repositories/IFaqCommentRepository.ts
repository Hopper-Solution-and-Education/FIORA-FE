import { CreateCommentRequest, FaqComment } from '../entities/models/faqs';

export interface IFaqCommentRepository {
  createComment(faqId: string, userId: string, request: CreateCommentRequest): Promise<FaqComment>;

  deleteComment(commentId: string): Promise<void>;

  getFaqComments(faqId: string): Promise<FaqComment[]>;
}
