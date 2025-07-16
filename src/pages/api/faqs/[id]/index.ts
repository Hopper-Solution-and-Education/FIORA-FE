import { deleteFaqUseCase, updateFaqUseCase } from '@/features/faqs/application/use-cases';
import { getFaqDetailUseCase } from '@/features/faqs/application/use-cases/getFaqDetailUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'PUT':
      return PUT(req, res, userId);
    case 'DELETE':
      return DELETE(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

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
  if (!userId) {
    return createError(res, RESPONSE_CODE.UNAUTHORIZED, Messages.UNAUTHORIZED);
  }
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

async function DELETE(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (!userId) {
    return createError(res, RESPONSE_CODE.UNAUTHORIZED, Messages.UNAUTHORIZED);
  }
  try {
    const { id } = req.query;

    // Execute use case
    await deleteFaqUseCase.execute(id as string);

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
