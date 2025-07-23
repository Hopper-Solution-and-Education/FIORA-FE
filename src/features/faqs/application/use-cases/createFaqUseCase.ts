import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import { CreateFaqRequest, FaqDetailData, PostType } from '../../domain/entities/models/faqs';
import { IFaqRepository } from '../../domain/repositories/IFaqRepository';
import { faqRepository } from '../../infrastructure/repositories';

export class CreateFaqUseCase {
  constructor(private faqsRepository: IFaqRepository) {}

  async execute(params: CreateFaqRequest): Promise<FaqDetailData> {
    const dup = await prisma.post.findFirst({
      where: { title: params.title, type: PostType.FAQ },
    });

    if (dup) {
      throw new Error(Messages.FAQ_TITLE_ALREADY_EXISTS);
    }

    return this.faqsRepository.createFaq(params);
  }
}

export const createFaqUseCase = new CreateFaqUseCase(faqRepository);
