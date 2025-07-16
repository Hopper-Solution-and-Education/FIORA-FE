import { deleteCommentUseCase } from '@/features/faqs/application/use-cases/deleteCommentUseCase';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  DELETE: ['Admin', 'CS', 'User'],
})(async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'DELETE':
      return DELETE(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { commentId } = req.query;

    await deleteCommentUseCase.execute(commentId as string);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.DELETE_COMMENT_SUCCESS));
  } catch (error: any) {
    if (error.message === Messages.COMMENT_NOT_FOUND) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.COMMENT_NOT_FOUND));
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
