import { prisma } from '@/config';
import { PostType } from '@/features/helps-center/domain/entities/models/faqs';
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
  const post = await prisma.post.findFirst({
    where: {
      type: PostType.TUTORIAL,
    },
    include: {
      User: true,
    },
  });
  return res.status(200).json({
    data: post,
    status: 200,
  });
}
