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

export interface FaqsListResponse {
  faqs: Faq[];
  currentPage: number;
  pageSize: number;
  // totalCount: number;
  // totalPages: number;
}

export interface CategoryWithFaqs {
  categoryId: string;
  categoryName: string;
  totalFaqs: number;
  faqs: {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    type: any;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface FaqsCategoriesResponse {
  id: string;
  name: string;
}

export interface FaqsListCategoriesResponse {
  categoriesData: CategoryWithFaqs[];
}

export interface FaqsListQueryParams {
  type?: FaqsGetListType;
  limit?: number;
  // Legacy support
  page?: number;
  pageSize?: number;
  filters?: {
    search?: string;
    categories?: string[];
  };
  orderBy?: string;
  orderDirection?: string;
}

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

export enum FaqsGetListType {
  LIST = 'list',
  CATEGORIES = 'categories',
}
