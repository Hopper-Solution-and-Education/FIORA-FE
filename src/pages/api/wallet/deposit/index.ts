import { ATTACHMENT_CONSTANTS } from '@/features/setting/api/constants/attachmentConstants';
import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency, DepositRequestStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const DepositRequestStatusSchema = z.nativeEnum(DepositRequestStatus);

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

const PostBodySchema = z.object({
  packageFXId: z.string().min(1, 'PackageFX ID is required'),
  attachmentData: AttachmentDataSchema.optional(),
});

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  try {
    switch (req.method) {
      case 'GET':
        return GET(req, res, userId);
      case 'POST':
        return POST(req, res, userId);
      default:
        return createError(res, RESPONSE_CODE.METHOD_NOT_ALLOWED, Messages.METHOD_NOT_ALLOWED);
    }
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { type } = req.query;
    if (!type) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT);
    }

    const parseResult = DepositRequestStatusSchema.safeParse(type);

    if (!parseResult.success) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_DEPOSIT_REQUEST_TYPE);
    }

    const depositRequests = await walletUseCase.getDepositRequestsByType(userId, parseResult.data);

    return res
      .status(RESPONSE_CODE.OK)
      .json(
        createResponse(RESPONSE_CODE.OK, Messages.GET_DEPOSIT_REQUEST_SUCCESS, depositRequests),
      );
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const body = PostBodySchema.safeParse(req.body);
    if (!body.success) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.MISSING_PARAMS_INPUT);
    }
    const { packageFXId, attachmentData } = body.data;

    // Get currency from header
    const currency = req.headers['x-user-currency'] as string;
    if (!currency) {
      return createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.INVALID_CURRENCY);
    }

    try {
      const depositRequest = await walletUseCase.createDepositRequestWithUniqueRefCode(
        userId,
        packageFXId,
        attachmentData,
        currency as Currency,
      );
      return res
        .status(RESPONSE_CODE.OK)
        .json(
          createResponse(RESPONSE_CODE.OK, Messages.CREATE_DEPOSIT_REQUEST_SUCCESS, depositRequest),
        );
    } catch (err: any) {
      return createError(res, RESPONSE_CODE.NOT_FOUND, err.message || 'PackageFX not found');
    }
  } catch (error: any) {
    return createError(
      res,
      RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      error.message || Messages.INTERNAL_ERROR,
    );
  }
}
