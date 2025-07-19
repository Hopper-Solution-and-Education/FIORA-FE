import { prisma } from '@/config';
import { withAuthorization } from '@/shared/utils/authorizationWrapper';
import { PostType, Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuthorization({
  POST: ['Admin', 'CS'],
})(async (req: NextApiRequest, res: NextApiResponse, userId: string) => {
  switch (req.method) {
    case 'POST':
      return POST(req, res, userId);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
});

async function POST(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { title, description, content, categoryId } = req.body as {
      title: string;
      description: string;
      content: string;
      categoryId: string;
    };

    if (!title || !content || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dup = await prisma.post.findFirst({
      where: { title, type: PostType.FAQ },
    });

    if (dup) {
      return res.status(409).json({ error: 'Title already exists' });
    }

    const faq = await prisma.post.create({
      data: {
        title,
        description,
        content,
        type: PostType.FAQ,
        createdBy: userId,
        User: {
          connect: { id: userId },
        },
        PostCategory: {
          connect: { id: categoryId },
        },
      } as Prisma.PostCreateInput,
    });

    return res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
