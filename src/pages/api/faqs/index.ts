import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser, isAdminOrCS } from '@/lib/utils/auth';
import { PostType, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { prisma } from '@/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page = 1, limit = 10 } = req.query;

    const faqs = await prisma.post.findMany({
      where: { type: PostType.FAQ },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(faqs);
  }

  if (req.method === 'POST') {
    const sessionUser = await getSessionUser(req, res);
    if (!sessionUser || !isAdminOrCS(sessionUser.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { title, description, content, categoryId } = req.body as {
      title: string;
      description: string;
      content: string;
      categoryId: string;
    };

    if (!title || !description || !content || !categoryId) {
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
        id: randomUUID(),
        title,
        description,
        content,
        type: PostType.FAQ,
        createdBy: sessionUser.id,
        User: {
          connect: { id: sessionUser.id },
        },
        PostCategory: {
          connect: { id: categoryId },
        },
      } as Prisma.PostCreateInput,
    });

    return res.status(201).json(faq);
  }

  return res.status(405).end();
}
