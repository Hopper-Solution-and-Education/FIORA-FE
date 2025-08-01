import { FaqsImportResult, FaqsRowRaw } from '../entities/models/faqs';

export interface IFaqImportRepository {
  importFaqs(validatedRows: FaqsRowRaw[], userId: string): Promise<FaqsImportResult>;

  checkExistingFaqTitles(titles: string[], userId: string): Promise<string[]>;
}
