import { IFaqRepository } from '../../domain/repositories';
import { faqRepository } from '../../infrastructure/repositories';

export class DeleteFaqUseCase {
  constructor(private readonly faqRepository: IFaqRepository) {}

  async execute(faqId: string): Promise<void> {
    await this.faqRepository.deleteFaq(faqId);
  }
}

export const deleteFaqUseCase = new DeleteFaqUseCase(faqRepository);
