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
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
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
