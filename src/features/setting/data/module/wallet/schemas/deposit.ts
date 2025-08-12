import { ATTACHMENT_CONSTANTS } from '@/features/setting/data/module/attachment/constants/attachmentConstants';
import { DepositRequestStatus } from '@prisma/client';
import { z } from 'zod';

export const DepositRequestStatusSchema = z.nativeEnum(DepositRequestStatus);

const AttachmentDataSchema = z.object({
  type: z.string().min(1, 'Attachment type is required'),
  size: z
    .number()
    .min(0, 'Attachment size must be non-negative')
    .max(
      ATTACHMENT_CONSTANTS.MAX_FILE_SIZE,
      `File size must not exceed ${ATTACHMENT_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    ),
  url: z.string().url('Invalid attachment URL'),
  path: z.string().min(1, 'Attachment path is required'),
});

export const PostBodySchema = z.object({
  packageFXId: z.string().min(1, 'PackageFX ID is required'),
  attachmentData: AttachmentDataSchema.optional(),
});
