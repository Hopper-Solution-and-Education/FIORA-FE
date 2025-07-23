// ============================================================================
// CORE DOMAIN ENTITIES
// ============================================================================

export interface Faq {
  id: string;
  category: string;
  type: PostType;
  title: string;
  description: string;
  content: string;
  url?: string;
  typeOfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended FAQ interface for detail view with comments and reactions
export interface FaqDetail extends Faq {
  User?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  Comment?: FaqComment[];
  Reaction?: FaqReaction[];
}

export interface FaqComment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  parentId?: string | null;
  User?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export interface FaqReaction {
  id: string;
  reactionType: ReactionType;
  userId: string;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface FaqDetailData {
  id: string;
  title: string;
  description?: string;
  content: string;
  categoryId?: string;
  createdAt: Date;
  updatedAt?: Date;
  User?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  Comment?: FaqComment[];
  Reaction?: FaqReaction[];
  // Optional related articles when using ?include=related
  relatedArticles?: Faq[];
}

export interface CreateCommentRequest {
  content: string;
  replyToUsername?: string;
}

export interface UpdateFaqRequest {
  title: string;
  description?: string;
  content: string;
  categoryId: string;
}

export interface CreateFaqRequest {
  title: string;
  description?: string;
  content: string;
  categoryId: string;
  userId: string;
}

export interface GetFaqDetailOptions {
  includes?: string[];
  trackView?: boolean;
}

export interface ViewTrackingResult {
  success: boolean;
  alreadyViewed?: boolean;
}

export interface ReactionCounts {
  bad: number;
  neutral: number;
  good: number;
}

// ============================================================================
// LIST/PAGINATION TYPES
// ============================================================================

export interface FaqListResponse {
  faqs: Faq[];
  currentPage?: number;
  limit?: number;
  // totalCount: number;
  // totalPages: number;
}

export interface FaqCategory {
  id: string;
  name: string;
  type: PostType;
  description: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqsCategoriesResponse {
  id: string;
  name: string;
}

export interface FaqsCategoriesWithPostResponse {
  id: string;
  name: string;
  faqs: Faq[];
}

export interface FaqsCategoriesWithPostParams {
  type?: PostType;
  limit?: number;
}

export interface FaqsListQueryParams {
  // Legacy support
  page?: number;
  limit?: number;
  filters?: {
    search?: string;
    categories?: string[];
  };
  orderBy?: string;
  orderDirection?: string;
  type?: PostType;
}

// ============================================================================
// IMPORT/VALIDATION TYPES
// ============================================================================

export interface FaqsRowRaw {
  category: string;
  type: PostType;
  title: string;
  description: string;
  content: string;
  url: string;
  typeOfUrl: UrlType;
}

export interface ValidationError {
  field: string;
  message: string;
  type?: 'format' | 'required' | 'duplicate';
}

export interface FaqsRowValidated {
  isValid: boolean;
  validationErrors: ValidationError[];
  rowData: FaqsRowRaw | null;
}

export interface FaqsImportValidationResult {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  rows: FaqsRowValidated[];
  hasErrors: boolean;
  missingColumns?: string[];
  structuralError?: string;
}

export interface FaqsImportResult {
  successful: number;
  totalProcessed: number;
  failed: number;
}

// ============================================================================
// ENUMS & TYPES
// ============================================================================

export enum PostType {
  FAQ = 'FAQ',
  NEWS = 'NEWS',
  TUTORIAL = 'TUTORIAL',
  INTRO = 'INTRO',
}

export enum UrlType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum ReactionType {
  BAD = 'bad',
  NEUTRAL = 'neutral',
  GOOD = 'good',
}
