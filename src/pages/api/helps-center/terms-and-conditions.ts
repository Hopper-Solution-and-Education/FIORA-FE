import { prisma } from '@/config';
import { PostType } from '@/features/helps-center/domain/entities/models/faqs';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        case 'POST':
          return POST(request, response);
        default:
          return response.status(405).json({ error: 'Method not allowed' });
      }
    },
    req,
    res,
  );

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const data = await prisma.post.findFirst({
    where: {
      type: PostType.TNC,
    },
    include: {
      User: true,
    },
  });
  return res.status(RESPONSE_CODE.OK).json({
    data,
    status: RESPONSE_CODE.OK,
  });
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;
  if (!url) {
    return res.status(RESPONSE_CODE.BAD_REQUEST).json({ error: 'No file provided' });
  }

  try {
    const data = await prisma.post.findFirst({
      where: {
        type: PostType.TNC,
      },
    });

    if (!data) {
      return res.status(RESPONSE_CODE.NOT_FOUND).json({ error: 'Terms and Conditions not found' });
    }

    await prisma.post.update({
      where: { id: data.id },
      data: { content: url },
    });
    return res.status(RESPONSE_CODE.OK).json({ data, status: RESPONSE_CODE.OK });
  } catch (error) {
    console.error(error);
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error', status: RESPONSE_CODE.INTERNAL_SERVER_ERROR });
  }
}

export default handler;
