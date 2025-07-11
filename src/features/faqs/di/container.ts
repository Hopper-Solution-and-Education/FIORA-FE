import { FaqsImportUseCase } from '../application/use-cases/faqsImportUseCase';
import { GetFaqCategoriesUseCase } from '../application/use-cases/getFaqCategoriesUseCase';
import { GetFaqsListUseCase } from '../application/use-cases/getFaqsListUseCase';
// New use cases
import { CreateCommentUseCase } from '../application/use-cases/createCommentUseCase';
import { CreateReactionUseCase } from '../application/use-cases/createReactionUseCase';
import { DeleteCommentUseCase } from '../application/use-cases/deleteCommentUseCase';
import { DeleteFaqUseCase } from '../application/use-cases/deleteFaqUseCase';
import { DeleteReactionUseCase } from '../application/use-cases/deleteReactionUseCase';
import { GetFaqDetailUseCase } from '../application/use-cases/getFaqDetailUseCase';
import { UpdateFaqUseCase } from '../application/use-cases/updateFaqUseCase';

import { FaqsValidationService } from '../domain/services/FaqsValidationService';
import { importService } from '../domain/services/ImportService';
import { FaqsRepository } from '../infrastructure/repositories';

// Initialize repositories
const faqsRepository = new FaqsRepository();
const validationService = new FaqsValidationService();
const fileParsingService = importService.getFileParsingService();

// Initialize existing use cases
export const faqsImportUseCase = new FaqsImportUseCase(
  faqsRepository,
  validationService,
  fileParsingService,
);

export const getFaqsListUseCase = new GetFaqsListUseCase(faqsRepository);
export const getFaqCategoriesUseCase = new GetFaqCategoriesUseCase(faqsRepository);

// Initialize new use cases for FAQ detail operations
export const getFaqDetailUseCase = new GetFaqDetailUseCase(faqsRepository);
export const updateFaqUseCase = new UpdateFaqUseCase(faqsRepository);
export const deleteFaqUseCase = new DeleteFaqUseCase(faqsRepository);
export const createReactionUseCase = new CreateReactionUseCase(faqsRepository);
export const deleteReactionUseCase = new DeleteReactionUseCase(faqsRepository);
export const createCommentUseCase = new CreateCommentUseCase(faqsRepository);
export const deleteCommentUseCase = new DeleteCommentUseCase(faqsRepository);

export { faqsRepository, fileParsingService, validationService };
