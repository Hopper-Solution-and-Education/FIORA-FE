import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import RESPONSE_CODE from '../constants/RESPONSE_CODE';
import { Messages } from '../constants/message';
import { SessionUser } from '../types/session';

type HandlerWithUser = (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  user: SessionUser,
) => Promise<void>;

export function sessionWrapper(handler: HandlerWithUser): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
      res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
      return;
    }

    const userId = session.user.id;

    try {
      await handler(req, res, userId, session.user as SessionUser);
    } catch (error: any) {
      console.error('Error in sessionWrapper:', error);
      res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_ERROR });
    }
  };
}
