import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib';
import { sessionWrapper } from '@/shared/utils/sessionWrapper';
import { NextApiRequest, NextApiResponse } from 'next';

export default sessionWrapper((req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'POST':
          return POST(request, response);
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

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { url, path, type, size } = req.body;
  if (!url || !path || !type) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'No file provided' });
  }

  try {
    const attachment = await prisma.attachment.create({
      data: { url, path, type, size },
    });
    return res.status(RESPONSE_CODE.OK).json({ data: attachment, status: RESPONSE_CODE.OK });
  } catch (error) {
    console.error(error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error', status: RESPONSE_CODE.INTERNAL_SERVER_ERROR });
  }
}
