export const ATTACHMENT_CONSTANTS = {
  TYPES: {
    DEPOSIT_PROOF: 'DEPOSIT',
    RECEIPT: 'RECEIPT',
    DOCUMENT: 'DOCUMENT',
    IMAGE: 'IMAGE',
    PDF: 'PDF',
  },
  DEFAULT_SIZE: 0,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
} as const;

export type AttachmentType =
  (typeof ATTACHMENT_CONSTANTS.TYPES)[keyof typeof ATTACHMENT_CONSTANTS.TYPES];
