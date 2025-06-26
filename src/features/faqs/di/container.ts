import { FaqsImportUseCase } from '../application/use-cases/faqsImportUseCase';
import { GetFaqsListUseCase, GetFaqCategoriesUseCase } from '../application/usecases';
import { FaqsRepository } from '../infrastructure/repositories/FaqsRepository';
import { FaqsValidationService } from '../domain/services/FaqsValidationService';
import { importService } from '../../../shared/services/import/ImportService';

// Initialize repositories
const faqsRepository = new FaqsRepository();
const validationService = new FaqsValidationService();
const fileParsingService = importService.getFileParsingService();

// Initialize use cases
export const faqsImportUseCase = new FaqsImportUseCase(
  faqsRepository,
  validationService,
  fileParsingService,
);

export const getFaqsListUseCase = new GetFaqsListUseCase(faqsRepository);
export const getFaqCategoriesUseCase = new GetFaqCategoriesUseCase(faqsRepository);

export { faqsRepository, validationService, fileParsingService };
