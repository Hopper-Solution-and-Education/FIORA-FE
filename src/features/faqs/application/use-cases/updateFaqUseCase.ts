import { UpdateFaqRequest } from '../../domain/entities/models/faqs';
import { IFaqRepository } from '../../domain/repositories/IFaqRepository';
import { faqRepository } from '../../infrastructure/repositories';

export interface UpdateFaqUseCaseRequest {
  faqId: string;
  updateData: UpdateFaqRequest;
  userId: string;
}

export class UpdateFaqUseCase {
  constructor(private readonly faqRepository: IFaqRepository) {}

  async execute(request: UpdateFaqUseCaseRequest): Promise<void> {
    const { faqId, updateData, userId } = request;

    // Validate that FAQ exists
    const existingFaq = await this.faqRepository.getFaqDetail(faqId);
    if (!existingFaq) {
      throw new Error('FAQ not found');
    }

    // Update the FAQ
    await this.faqRepository.updateFaq(faqId, updateData, userId);
  }
}

export const updateFaqUseCase = new UpdateFaqUseCase(faqRepository);
