/**
 * FAQ Repositories - Split by Responsibility
 *
 * - FaqRepository: Core CRUD operations (includes simple view tracking)
 * - FaqCommentRepository: Comment operations
 * - FaqReactionRepository: Reaction operations
 * - FaqImportRepository: Import operations
 */

// Individual specialized repositories
export * from './FaqCategoryRepository';
export * from './FaqCommentRepository';
export * from './FaqImportRepository';
export * from './FaqReactionRepository';
export * from './FaqRepository';
