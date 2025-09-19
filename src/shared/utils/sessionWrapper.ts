import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import RESPONSE_CODE from '../constants/RESPONSE_CODE';
import { Messages } from '../constants/message';
import { SessionUser } from '../types/session';

type HandlerWithUser = (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  user: SessionUser,
) => Promise<any>;

export function sessionWrapper(handler: HandlerWithUser): any {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
      res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
      return;
    }

    // const userId = session.user.id;
    const userId = '1d791b6f-38ea-4cf1-9219-4b0a0fbd37c6';

    try {
      await handler(req, res, userId, session.user as SessionUser);
    } catch (error: any) {
      console.error('Error in sessionWrapper:', error);
      res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: Messages.INTERNAL_ERROR });
    }
  };
}
