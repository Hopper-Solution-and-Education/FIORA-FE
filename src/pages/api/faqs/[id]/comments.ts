import { createCommentUseCase } from '@/features/faqs/application/use-cases';
import { getFaqCommentsUseCase } from '@/features/faqs/application/use-cases/getFaqCommentsUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import type { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res, userId);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
});

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const comments = await getFaqCommentsUseCase.execute({
      faqId: id as string,
      skip: Number(req.query?.skip ?? 0),
      take: Number(req.query?.take ?? 10),
    });

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FAQ_COMMENTS_SUCCESS, comments));
  } catch (error: any) {
    if (error.message === Messages.FAQ_NOT_FOUND) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.FAQ_NOT_FOUND));
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

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;

    const { content, replyToUsername } = req.body as {
      content: string;
      replyToUsername?: string;
    };

    const comment = await createCommentUseCase.execute({
      faqId: id as string,
      userId,
      commentData: {
        content,
        replyToUsername,
      },
    });

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(createResponse(RESPONSE_CODE.CREATED, Messages.CREATE_COMMENT_SUCCESS, comment));
  } catch (error: any) {
    if (error.message === Messages.FAQ_NOT_FOUND) {
      return res
        .status(RESPONSE_CODE.NOT_FOUND)
        .json(createError(res, RESPONSE_CODE.NOT_FOUND, Messages.FAQ_NOT_FOUND));
    }
    if (error.message === Messages.VALIDATION_ERROR) {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createError(res, RESPONSE_CODE.BAD_REQUEST, Messages.VALIDATION_ERROR));
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
