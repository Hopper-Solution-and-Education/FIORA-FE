export const FAQ_IMPORT_CONSTANTS = {
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_RECORDS: 1000,
  ALLOWED_TYPES: {
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    CSV: 'text/csv',
  },
  VALIDATION_TABS: ['all', 'valid', 'invalid'] as const,
  ERROR_MESSAGES: {
    FILE_TOO_LARGE: 'File is too large. Maximum size is 2MB.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a .csv or .xlsx file.',
    UPLOAD_FAILED: 'Upload failed',
    IMPORT_FAILED: 'Import failed',
    UNEXPECTED_ERROR: 'An unexpected error occurred',
  },
  FILTER_TYPES: {
    ALL: 'all',
    VALID: 'valid',
    INVALID: 'invalid',
  },
  TEXT_TRUNCATE_LIMIT: 100,
  STATS_DISPLAY: [
    { label: 'Total', value: 0, variant: 'default' },
    { label: 'Valid', value: 0, variant: 'success' },
    { label: 'Invalid', value: 0, variant: 'error' },
  ],
} as const;

export type ValidationTab = (typeof FAQ_IMPORT_CONSTANTS.VALIDATION_TABS)[number];

export const FAQ_LIST_CONSTANTS = {
  FAQS_PER_CATEGORY: 4,
  MOST_VIEWED_LIMIT: 8,
};
