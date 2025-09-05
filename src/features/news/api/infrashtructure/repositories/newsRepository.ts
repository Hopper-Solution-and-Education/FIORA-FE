import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import { AppError } from '@/shared/lib';
import { Post, PostType, Prisma } from '@prisma/client';
import { INewsRepository } from '../../domain/repository/newsRepository';
import {
  ListNewsResponse,
  NewsCreationRequest,
  NewsQueryParams,
  NewsResponse,
  NewsUpdateRequest,
} from '../../types/newsDTO';
export class NewsRepository implements INewsRepository {
  async getNewsById(newsId: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: {
        id: newsId,
      },
    });
  }
  async increaseView(newsId: string): Promise<boolean> {
    const result = await prisma.post.update({
      where: {
        id: newsId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return !!result;
  }
  async updateNews(post: NewsUpdateRequest, id: string): Promise<Post> {
    const resultUpdate = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title: post.title,
        description: post.description,
        content: post.content,
        categoryId: post.categoryId,
        updatedBy: post.userId,
      },
    });
    console.log('Kết quả: ', resultUpdate);
    return resultUpdate;
  }
  async delete(postId: string): Promise<void> {
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async titleExists(title: string): Promise<boolean> {
    const exists = await prisma.post.findFirst({
      where: {
        title: title,
      },
    });
    return exists ? true : false;
  }

  async create(postCreationParam: NewsCreationRequest) {
    //check account
    const accountExists = await prisma.account.findFirst({
      where: {
        userId: postCreationParam.userId,
      },
    });

    if (!accountExists) throw new AppError(400, Messages.ACCOUNT_NOT_FOUND);

    //check category
    const categoryExists = await prisma.postCategory.findFirst({
      where: {
        id: postCreationParam.categoryId,
      },
    });

    if (!categoryExists) {
      throw new AppError(400, Messages.CATEGORY_NOT_FOUND);
    }

    //check title
    const titleExists = await prisma.post.findFirst({
      where: {
        title: postCreationParam.title,
      },
    });

    if (titleExists) throw new AppError(400, Messages.FAQ_TITLE_ALREADY_EXISTS);

    try {
      const post = await prisma.post.create({
        data: {
          title: postCreationParam.title,
          description: postCreationParam.description,
          content: postCreationParam.content,
          userId: postCreationParam.userId,
          type: PostType.NEWS,
          categoryId: postCreationParam.categoryId,
          createdBy: postCreationParam.userId,
        },
      });
      return post;
    } catch (error: unknown) {
      console.log('Lỗi khi tạo mới NEWS: ', error);
      throw new AppError(303, 'Create NEWS failfail');
    }
  }
  async getAll(params: NewsQueryParams): Promise<ListNewsResponse> {
    const {
      page = 1,
      limit = 0,
      filters = { search: '', categories: [] },
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = params;

    const skip: number = (page - 1) * limit;

    try {
      //khởi tạo điều kiện
      const whereClause: Prisma.PostWhereInput = {
        type: PostType.NEWS,
      };

      //Nếu có categories thì lọc theo categories
      if (filters.categories && filters.categories.length > 0) {
        whereClause.PostCategory = {
          id: {
            in: filters.categories,
          },
        };
      }

      //Nếu có search thì tìm kiếm theo search key work
      const searchKeywork = filters.search;
      if (searchKeywork) {
        whereClause.OR = [
          {
            title: {
              contains: searchKeywork,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchKeywork,
              mode: 'insensitive',
            },
          },
        ];
      }

      const posts: NewsResponse[] = await prisma.post.findMany({
        where: whereClause,
        skip: skip,
        take: limit,
        orderBy: { [orderBy]: orderDirection },
        select: {
          id: true,
          title: true,
          description: true,
          content: true,
          views: true,
          userId: true,
          type: true,
          categoryId: true,
        },
      });
      const response: ListNewsResponse = {
        news: posts,
        currentPage: page,
        limit: limit,
      };
      return response;
    } catch (error: unknown) {
      console.log('Lõi khi lấy tin tức', error);
      throw new AppError(400, 'Lỗi khi lấy tin tức');
    }
  }
}

export const newsRepository: INewsRepository = new NewsRepository();
