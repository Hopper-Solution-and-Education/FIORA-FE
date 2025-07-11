/**
 * FAQ Repositories - Split by Responsibility
 *
 * - FaqRepository: Core CRUD operations (includes simple view tracking)
 * - FaqCommentRepository: Comment operations
 * - FaqReactionRepository: Reaction operations
 * - FaqImportRepository: Import operations
 * - FaqQueryRepository: List/search operations
 * - CompositeFaqsRepository: Aggregates all (maintains backward compatibility)
 */

// Individual specialized repositories
export * from './FaqCommentRepository';
export * from './FaqImportRepository';
export * from './FaqQueryRepository';
export * from './FaqReactionRepository';
export * from './FaqRepository';

// Composite repository (main implementation)
export * from './CompositeFaqsRepository';

// Legacy export for backward compatibility
export { CompositeFaqsRepository as FaqsRepository } from './CompositeFaqsRepository';
