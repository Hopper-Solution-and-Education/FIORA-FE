import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface DeleteFaqUseCaseRequest {
  faqId: string;
}

export class DeleteFaqUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: DeleteFaqUseCaseRequest): Promise<void> {
    const { faqId } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqsRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Delete the FAQ (this will cascade delete related comments and reactions)
    await this.faqsRepository.deleteFaq(faqId);
  }
}
