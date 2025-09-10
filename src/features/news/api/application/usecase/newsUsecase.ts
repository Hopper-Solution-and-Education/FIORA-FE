import { Post } from '@prisma/client';
import { INewsRepository } from '../../domain/repository/newsRepository';
import { newsRepository } from '../../infrashtructure/repositories/newsRepository';
import {
  ListNewsResponse,
  NewsCreationRequest,
  NewsDetailResponse,
  NewsQueryParams,
  NewsUpdateRequest,
} from '../../types/newsDTO';
class NewsUsercase {
  constructor(private newsRepo: INewsRepository) {}
  async getAll(queryParam: NewsQueryParams): Promise<ListNewsResponse | null> {
    return this.newsRepo.getAll(queryParam);
  }

  async getNewsByIdAndIncrease(newsId: string, userId: string): Promise<NewsDetailResponse | null> {
    //get detail
    const result: NewsDetailResponse | null = await this.newsRepo.getNewsByIdAndUserId(
      newsId,
      userId,
    );
    //increase view
    await this.newsRepo.increaseView(newsId);
    return result;
  }

  async getNewsById(newsId: string): Promise<Post | null> {
    return await this.newsRepo.getNewsById(newsId);
  }

  async createNews(createParam: NewsCreationRequest): Promise<Post> {
    return await newsRepository.create(createParam);
  }

  async titleExists(title: string): Promise<boolean> {
    return this.newsRepo.titleExists(title);
  }

  async updateNews(updateParam: NewsUpdateRequest, postId: string): Promise<Post | null> {
    return await newsRepository.updateNews(updateParam, postId);
  }

  async deleteNews(postId: string): Promise<void> {
    return await newsRepository.delete(postId);
  }
}
export const newsUsercase = new NewsUsercase(newsRepository);
