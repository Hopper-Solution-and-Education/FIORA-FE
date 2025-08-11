import { walletUseCase } from '@/features/setting/api/domain/use-cases/walletUsecase';
import { AttachmentData } from '@/features/setting/api/types/attachmentTypes';
import {
  DepositRequestStatusSchema,
  PostBodySchema,
} from '@/features/setting/data/module/wallet/schemas/deposit';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { SessionUser } from '@/shared/types/session';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { Currency } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(
  async (req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) => {
    try {
      switch (req.method) {
        case 'GET':
          return GET(req, res, userId);
        case 'POST':
          return POST(req, res, userId, user);
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
  },
);

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

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string, user: SessionUser) {
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
        attachmentData as AttachmentData,
        currency as Currency,
        user,
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
