import { createReactionUseCase, deleteReactionUseCase } from '@/features/faqs/di/container';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['Admin', 'CS', 'User'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    case 'DELETE':
      return DELETE(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id: postId } = req.query;

    const { reactionType } = req.body;

    // Execute use case
    await createReactionUseCase.execute({
      faqId: postId as string,
      userId,
      reactionType,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.CREATE_REACTION_SUCCESS));
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
  try {
    const { id: postId } = req.query;

    // Execute use case
    await deleteReactionUseCase.execute({
      faqId: postId as string,
      userId,
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_REACTION_SUCCESS));
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
