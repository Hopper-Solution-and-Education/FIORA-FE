import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import RESPONSE_CODE from '../constants/RESPONSE_CODE';
import { Messages } from '../constants/message';

type HandlerWithUser = (req: NextApiRequest, res: NextApiResponse, userId: string) => Promise<void>;

export function sessionWrapper(handler: HandlerWithUser): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // const session = await getServerSession(req, res, authOptions);

    // if (!session || !session.user?.id) {
    //   return res.status(RESPONSE_CODE.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    // }

    // const userId = session.user.id;

    const userId = 'd64dd156-37f3-4cdf-a502-0482db4997de';

    // const userId = 'd64dd156-37f3-4cdf-a502-0482db4997de';

    // const userId = 'd64dd156-37f3-4cdf-a502-0482db4997de';

    try {
      return await handler(req, res, userId);
    } catch (error: any) {
      console.error('Error in sessionWrapper:', error);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.INTERNAL_ERROR });
    }
  };
}
