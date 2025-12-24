import { getAcknowledgments } from '@/features/acknowledgment/infrastructure/services/acknowledgment.service';
import { Messages } from '@/shared/constants';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export const maxDuration = 30; // 30 seconds

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse, userId: string) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response, userId);
        default:
          return response
            .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
            .json({ error: Messages.METHOD_NOT_ALLOWED });
      }
    },
    req,
    res,
  ),
);

export async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res
      .status(RESPONSE_CODE.METHOD_NOT_ALLOWED)
      .json({ error: Messages.METHOD_NOT_ALLOWED });
  }

  const { isCompleted } = req.body;

  const response = await getAcknowledgments(userId, isCompleted);

  return res.status(RESPONSE_CODE.OK).json({
    message: 'success',
    data: response,
  });
}
