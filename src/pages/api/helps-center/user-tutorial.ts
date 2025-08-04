import { prisma } from '@/config';
import { PostType } from '@/features/helps-center/domain/entities/models/faqs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return GET(req, res);
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const aboutUs = await prisma.post.findFirst({
      where: {
        type: PostType.TUTORIAL,
      },
      include: {
        User: true,
      },
    });
    return res.status(200).json({
      data: aboutUs,
      status: 200,
    });
  } catch (error) {
    console.log('🚀 ~ GET ~ error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
