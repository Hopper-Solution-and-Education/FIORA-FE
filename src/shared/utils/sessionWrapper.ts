import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import RESPONSE_CODE from '../constants/RESPONSE_CODE';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Messages } from '../constants/message';

type HandlerWithUser = (req: NextApiRequest, res: NextApiResponse, userId: string) => Promise<void>;

export function sessionWrapper(handler: HandlerWithUser): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Get the session directly from getServerSession
    const session = await getServerSession(req, res, authOptions);

    // Check if session exists and has a valid user ID
    if (!session || !session.user?.id) {
      return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    }

    const userId = session.user.id;

    try {
      // Call the handler with the request, response, and userId
      return await handler(req, res, userId);
    } catch (error: any) {
      // Improved error handling: return a generic 500 error with the error message
      console.error('Error in sessionWrapper:', error);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.INTERNAL_ERROR });
    }
  };
}
