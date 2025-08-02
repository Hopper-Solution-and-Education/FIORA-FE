import {
  FaqDetail,
  GetFaqDetailOptions,
} from '@/features/helps-center/domain/entities/models/faqs';
import { IFaqRepository } from '@/features/helps-center/domain/repositories';
import { faqRepository } from '@/features/helps-center/infrastructure/repositories';

export interface GetFaqDetailRequest {
  faqId: string;
  includes?: string[];
  trackView?: boolean;
}

export class GetFaqDetailUseCase {
  constructor(private readonly faqsRepository: IFaqRepository) {}

  async execute(request: GetFaqDetailRequest): Promise<FaqDetail | null> {
    const { faqId, includes, trackView } = request;

    // Get FAQ detail with optional includes
    const options: GetFaqDetailOptions = {
      includes,
      trackView,
    };

    const faqDetail = await this.faqsRepository.getFaqDetail(faqId, options);

    if (!faqDetail) {
      return null;
    }

    // Track view if requested
    if (trackView) {
      // Increment view count
      this.faqsRepository.incrementViewCount(faqId).catch((error: any) => {
        console.error('Failed to increment FAQ view count:', error);
      });
    }

    return faqDetail;
  }
}

export const getFaqDetailUseCase = new GetFaqDetailUseCase(faqRepository);
