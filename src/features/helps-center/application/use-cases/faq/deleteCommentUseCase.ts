import { IFaqCommentRepository } from '@/features/helps-center/domain/repositories';
import { faqCommentRepository } from '../../../infrastructure/repositories';

export class DeleteCommentUseCase {
  constructor(private readonly faqCommentRepository: IFaqCommentRepository) {}

  async execute(commentId: string): Promise<void> {
    await this.faqCommentRepository.deleteComment(commentId);
  }
}

export const deleteCommentUseCase = new DeleteCommentUseCase(faqCommentRepository);
