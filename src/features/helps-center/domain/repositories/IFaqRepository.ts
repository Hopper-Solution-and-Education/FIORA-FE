import {
  CreateFaqRequest,
  FaqDetail,
  FaqListResponse,
  FaqsListQueryParams,
  GetFaqDetailOptions,
  UpdateFaqRequest,
} from '../entities/models/faqs';

export interface IFaqRepository {
  getFaqList(params: FaqsListQueryParams): Promise<FaqListResponse>;

  getFaqDetail(faqId: string, options?: GetFaqDetailOptions): Promise<FaqDetail | null>;

  updateFaq(faqId: string, updateData: UpdateFaqRequest, userId: string): Promise<void>;

  deleteFaq(faqId: string): Promise<void>;

  createFaq(params: CreateFaqRequest): Promise<FaqDetail>;

  incrementViewCount(faqId: string): Promise<void>;
}
