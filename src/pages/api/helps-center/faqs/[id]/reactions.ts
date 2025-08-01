import { createReactionUseCase } from '@/features/helps-center/application/use-cases/faq';
import { getFaqReactionsUseCase } from '@/features/helps-center/application/use-cases/faq/getFaqReactionsUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { Messages } from '@/shared/constants/message';
import { createError, createResponse } from '@/shared/lib/responseUtils/createResponse';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]';

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
    const { id: postId } = req.query;

    const reactions = await getFaqReactionsUseCase.execute(postId as string);

    return res
      .status(RESPONSE_CODE.OK)
      .json(createResponse(RESPONSE_CODE.OK, Messages.GET_FAQ_REACTIONS_SUCCESS, reactions));
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
