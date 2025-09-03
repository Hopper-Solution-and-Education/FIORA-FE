import { Post } from '@prisma/client';
import {
  ListNewsResponse,
  NewsCreationRequest,
  NewsQueryParams,
  NewsUpdateRequest,
} from '../../types/newsDTO';

export interface INewsRepository {
  getAll(params: NewsQueryParams): Promise<ListNewsResponse>;
  create(post: NewsCreationRequest): Promise<Post>;
  updateNews(post: NewsUpdateRequest, id: string): Promise<Post>;
  delete(postId: string): Promise<void>;
  titleExists(title: string): Promise<boolean>;
}
