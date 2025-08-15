import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import RESPONSE_CODE from '../constants/RESPONSE_CODE';
import { Messages } from '../constants/message';

type HandlerWithApiKey = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export function apiKeyWrapper(handler: HandlerWithApiKey): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const apiKey = req.headers['x-api-key'] || req.query.apiKey;

      if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(RESPONSE_CODE.UNAUTHORIZED).json({
          message: Messages.UNAUTHORIZED,
        });
      }

      return await handler(req, res);
    } catch (error: any) {
      console.error('Error in apiKeyWrapper:', error);
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.INTERNAL_ERROR });
    }
  };
}
