import { ReactionType } from '@/features/helps-center/domain/entities/models/faqs';

export interface ReactCreationRequest {
  userId: string;
  newsId: string;
  reactType: ReactionType;
}
