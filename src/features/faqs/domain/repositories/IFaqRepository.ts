import {
  FaqDetailData,
  FaqListResponse,
  FaqsListQueryParams,
  GetFaqDetailOptions,
  UpdateFaqRequest,
} from '../entities/models/faqs';

export interface IFaqRepository {
  /**
   * Get list of FAQs with pagination and filtering
   */
  getFaqList(params: FaqsListQueryParams): Promise<FaqListResponse>;

  /**
   * Get FAQ detail by ID with optional includes
   */
  getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetailData | null>;

  updateFaq(faqId: string, updateData: UpdateFaqRequest, userId: string): Promise<void>;

  deleteFaq(faqId: string): Promise<void>;

  /**
   * View count increment
   */
  incrementViewCount(faqId: string): Promise<void>;
}
