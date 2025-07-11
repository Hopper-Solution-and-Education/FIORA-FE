import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface DeleteReactionUseCaseRequest {
  faqId: string;
  userId: string;
}

export class DeleteReactionUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: DeleteReactionUseCaseRequest): Promise<void> {
    const { faqId, userId } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqsRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Delete the reaction
    await this.faqsRepository.deleteReaction(faqId, userId);
  }
}
