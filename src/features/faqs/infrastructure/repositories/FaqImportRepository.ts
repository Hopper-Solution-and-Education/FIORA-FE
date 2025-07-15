import { prisma } from '@/config';
import { FaqsImportResult, FaqsRowRaw, PostType } from '../../domain/entities/models/faqs';
import { generateUrlHtml } from '../../utils/contentUtils';

export interface IFaqImportRepository {
  importFaqs(validatedRows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult>;
  findOrCreateCategory(categoryName: string, type: string, userId: string): Promise<string | null>;
  checkExistingTitles(titles: string[], userId: string): Promise<string[]>;
}

/**
 * Repository for FAQ import operations
 */
export class FaqImportRepository implements IFaqImportRepository {
  async importFaqs(validatedRows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult> {
    if (validatedRows.length === 0) {
      return {
        successful: 0,
        totalProcessed: 0,
        failed: 0,
      };
    }

    try {
      // Get unique categories and create them first
      const uniqueCategories = [...new Set(validatedRows.map((row) => row.category))];

      const categoryResults = await Promise.all(
        uniqueCategories.map(async (categoryName) => ({
          name: categoryName,
          id: await this.findOrCreateCategory(categoryName, PostType.FAQ, userId),
        })),
      );

      const categoryIds: Record<string, string> = {};
      categoryResults.forEach(({ name, id }) => {
        if (id) {
          categoryIds[name] = id;
        }
      });

      // Format records with resolved category IDs
      const formattedRecords = validatedRows
        .filter((record) => categoryIds[record.category])
        .map((record) => {
          let content = record.content || '';
          if (record.url && record.typeOfUrl) {
            const urlHtml = generateUrlHtml(record.url, record.typeOfUrl);
            content = content ? `${content}\n\n${urlHtml}` : urlHtml;
          }

          return {
            categoryId: categoryIds[record.category],
            userId,
            createdBy: userId,
            title: record.title || '',
            description: record.description || '',
            content,
            type: record.type || PostType.FAQ,
          };
        });

      const result = await prisma.post.createMany({
        data: formattedRecords,
        skipDuplicates: true,
      });

      return {
        successful: result.count,
        totalProcessed: validatedRows.length,
        failed: validatedRows.length - result.count,
      };
    } catch (error) {
      console.error('Error importing FAQs:', error);
      return {
        successful: 0,
        totalProcessed: validatedRows.length,
        failed: validatedRows.length,
      };
    }
  }

  async findOrCreateCategory(
    categoryName: string,
    type: string,
    userId: string,
  ): Promise<string | null> {
    try {
      let category = await prisma.postCategory.findFirst({
        where: {
          name: categoryName,
        },
      });

      if (!category) {
        category = await prisma.postCategory.create({
          data: {
            name: categoryName,
            type: type as PostType,
            createdBy: userId,
          },
        });
      }

      return category?.id || null;
    } catch (error) {
      console.error('Error finding or creating category:', error);
      return null;
    }
  }

  async checkExistingTitles(titles: string[], userId: string): Promise<string[]> {
    try {
      const existingPosts = await prisma.post.findMany({
        where: {
          userId,
          type: PostType.FAQ,
          title: {
            in: titles,
          },
        },
        select: {
          title: true,
        },
      });

      return existingPosts.map((post) => post.title);
    } catch (error) {
      console.error('Error checking existing titles:', error);
      return [];
    }
  }
}
