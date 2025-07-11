import { FaqDetailData, GetFaqDetailOptions } from '../../domain/entities/models/faqs';
import { IFaqsRepository } from '../../domain/repositories/IFaqsRepository';

export interface GetFaqDetailRequest {
  faqId: string;
  includes?: string[];
  trackView?: boolean;
}

export class GetFaqDetailUseCase {
  constructor(private readonly faqsRepository: IFaqsRepository) {}

  async execute(request: GetFaqDetailRequest): Promise<FaqDetailData | null> {
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
