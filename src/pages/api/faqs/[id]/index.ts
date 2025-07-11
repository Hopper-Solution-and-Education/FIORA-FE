import {
  deleteFaqUseCase,
  getFaqDetailUseCase,
  updateFaqUseCase,
} from '@/features/faqs/di/container';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET(req, res);
  } else {
    return withAuthorization({
      PUT: ['Admin', 'CS'],
      DELETE: ['Admin', 'CS'],
    })(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
      switch (req.method) {
        case 'PUT':
          return PUT(req, res, userId);
        case 'DELETE':
          return DELETE(req, res);
        default:
          return res
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: 'Phương thức không được hỗ trợ' });
      }
    })(req, res);
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, include, track_view } = req.query;

    // Parse includes
    const includes = typeof include === 'string' ? include.split(',') : undefined;
    const shouldTrackView = track_view === 'true';

    // Execute use case to get FAQ detail
    const faqDetail = await getFaqDetailUseCase.execute({
      faqId: id as string,
      includes,
      trackView: shouldTrackView,
    });

    if (!faqDetail) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.FAQ_NOT_FOUND));
    }

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FAQ_DETAIL_SUCCESS, faqDetail));
  } catch (error: any) {
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error.validationErrors,
      });
    }
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    const { title, description, content, categoryId } = req.body;

    // Execute use case
    await updateFaqUseCase.execute({
      faqId: id as string,
      updateData: {
        title,
        description,
        content,
        categoryId,
      },
      userId,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.UPDATE_FAQ_SUCCESS));
  } catch (error: any) {
    if (error.message === 'FAQ not found') {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.FAQ_NOT_FOUND));
    }
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error.validationErrors,
      });
    }
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    // Execute use case
    await deleteFaqUseCase.execute({
      faqId: id as string,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_FAQ_SUCCESS));
  } catch (error: any) {
    if (error.message === 'FAQ not found') {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.FAQ_NOT_FOUND));
    }
    if (error.validationErrors) {
      return res.status(RESPONSE_CODE.BAD_REQUEST).json({
        status: RESPONSE_CODE.BAD_REQUEST,
        message: Messages.VALIDATION_ERROR,
        error: error.validationErrors,
      });
    }
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createError(
          res,
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || Messages.INTERNAL_ERROR,
        ),
      );
  }
}
