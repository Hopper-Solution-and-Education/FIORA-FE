import { prisma } from '@/config';
import {
  CreateFaqRequest,
  FaqDetail,
  PostType,
} from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqRepository } from '@/features/helps-center/domain/repositories';
import { Messages } from '@/shared/constants';
import { faqRepository } from '../../../infrastructure/repositories';

export class CreateFaqUseCase {
  constructor(private faqsRepository: IFaqRepository) {}

  async execute(params: CreateFaqRequest): Promise<FaqDetail> {
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
