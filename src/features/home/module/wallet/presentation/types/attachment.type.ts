export const ATTACHMENT_TYPES = {
  DEPOSIT_PROOF: 'DEPOSIT',
  RECEIPT: 'RECEIPT',
  DOCUMENT: 'DOCUMENT',
  IMAGE: 'IMAGE',
  PDF: 'PDF',
} as const;

export type AttachmentType = (typeof ATTACHMENT_TYPES)[keyof typeof ATTACHMENT_TYPES];

export interface AttachmentData {
  type: AttachmentType;
  size: number;
  url: string;
  path: string;
}

export interface CreateDepositRequestData {
  packageFXId: string;
  attachmentData?: AttachmentData;
}

export interface DepositRequestWithAttachment {
  id: string;
  userId: string;
  refCode: string;
  packageFXId: string;
  attachmentId?: string;
  status: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
}
