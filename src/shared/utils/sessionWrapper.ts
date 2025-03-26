import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import RESPONSE_CODE from '../constants/RESPONSE_CODE';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Messages } from '../constants/message';

type HandlerWithUser = (req: NextApiRequest, res: NextApiResponse, userId: string) => Promise<void>;

export function sessionWrapper(handler: HandlerWithUser): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getUserSession(req, res);
    if (!session || !session.user?.id) {
      return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    }

    const userId = session.user.id;

    try {
      return await handler(req, res, userId);
    } catch (error: any) {
      return res.status(RESPONSE_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };
}

export async function getUserSession(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = session.expiredTime - currentTime;
  if (timeLeft <= 0) {
    return null;
  }

  return session;
}
