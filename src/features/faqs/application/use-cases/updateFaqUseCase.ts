import { UpdateFaqRequest } from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface UpdateFaqUseCaseRequest {
  faqId: string;
  updateData: UpdateFaqRequest;
  userId: string;
}

export class UpdateFaqUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: UpdateFaqUseCaseRequest): Promise<void> {
    const { faqId, updateData, userId } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqsRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Update the FAQ
    await this.faqsRepository.updateFaq(faqId, updateData, userId);
  }
}
