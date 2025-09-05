import { ReactionType } from '@/features/helps-center/domain/entities/models/faqs';

export interface reactCreationRequest {
  userId: string;
  newsId: string;
  reactType: ReactionType;
}
