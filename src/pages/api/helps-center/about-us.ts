import { prisma } from '@/config';
import { PostType } from '@/features/helps-center/domain/entities/models/faqs';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { errorHandler } from '@/shared/lib/responseUtils/errors';
import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) =>
  errorHandler(
    async (request, response) => {
      switch (request.method) {
        case 'GET':
          return GET(request, response);
        default:
          return response.status(405).json({ error: 'Method not allowed' });
      }
    },
    req,
    res,
  );

async function GET(req: NextApiRequest, res: NextApiResponse) {
  const aboutUs = await prisma.post.findFirst({
    where: {
      type: PostType.ABOUT,
    },
    include: {
      User: true,
    },
  });
  return res.status(RESPONSE_CODE.OK).json({
    data: aboutUs,
    status: RESPONSE_CODE.OK,
  });
}
