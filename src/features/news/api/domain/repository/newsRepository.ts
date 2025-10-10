import { Post } from '@prisma/client';
import {
  ListNewsResponse,
  NewsCreationRequest,
  NewsDetailResponse,
  NewsQueryParams,
  NewsUpdateRequest,
} from '../../types/newsDTO';

export interface INewsRepository {
  getAll(params: NewsQueryParams): Promise<ListNewsResponse>;
  getNewsById(newsId: string): Promise<Post | null>;
  getNewsByIdAndUserId(
    newsId: string,
    userId: string | undefined,
  ): Promise<NewsDetailResponse | null>;
  increaseView(newsId: string): Promise<boolean>;
  create(post: NewsCreationRequest): Promise<Post>;
  updateNews(post: NewsUpdateRequest, id: string): Promise<Post>;
  delete(postId: string): Promise<void>;
  titleExists(title: string): Promise<boolean>;
}
