import { prisma } from '@/config';
import { IPostCategoryRepository } from '../../domain/repository/postCategoryRepository';

class PostCategoryRepository implements IPostCategoryRepository {
  async categoryExists(id: string): Promise<boolean> {
    return (await prisma.postCategory.findFirst({ where: { id: id } })) ? true : false;
  }
}

export const postCategoryReposiory = new PostCategoryRepository();
