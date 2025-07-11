import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface DeleteCommentUseCaseRequest {
  commentId: string;
}

export class DeleteCommentUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: DeleteCommentUseCaseRequest): Promise<void> {
    const { commentId } = request;

    // Delete the comment (repository should handle validation)
    await this.faqsRepository.deleteComment(commentId);
  }
}
