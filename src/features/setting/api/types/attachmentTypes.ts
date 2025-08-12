import { AttachmentType } from '../../data/module/attachment/constants/attachmentConstants';

export interface AttachmentData {
  type: AttachmentType;
  size: number;
  url: string;
  path: string;
  file?: File;
}

export interface CreateDepositRequestData {
  userId: string;
  packageFXId: string;
  refCode: string;
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
  createdAt: Date;
  updatedAt: Date;
  attachment?: {
    id: string;
    type: string;
    size: number;
    url: string;
    path: string;
  };
}
