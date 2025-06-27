import { AttachmentData } from '../../../presentation/types/attachment.type';

export interface CreateDepositRequestDto {
  packageFXId: string;
  attachmentData?: AttachmentData;
}
