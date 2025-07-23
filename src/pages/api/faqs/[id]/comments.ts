import { createCommentUseCase } from '@/features/faqs/application/use-cases';
import { getFaqCommentsUseCase } from '@/features/faqs/application/use-cases/getFaqCommentsUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
    case 'POST':
      return POST(req, res);
    default:
      return res
        .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
        .json({ error: Messages.METHOD_NOT_ALLOWED });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    const comments = await getFaqCommentsUseCase.execute(id as string);

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

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
  }

  const userId = session.user.id;

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
