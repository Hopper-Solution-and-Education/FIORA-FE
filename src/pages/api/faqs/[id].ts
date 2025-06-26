import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSessionUser, isAdminOrCS } from '@/lib/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    await prisma.post.update({
      where: { id: id as string },
      data: { views: { increment: 1 } },
    });

    const post = await prisma.post.findUnique({
      where: { id: id as string },
      include: {
        Reaction: true,
        Comment: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            User: true,
          },
        },
        PostCategory: true,
        User: true,
      },
    });

    if (!post) return res.status(404).json({ error: 'Not Found' });
    return res.status(200).json(post);
  }

  const user = await getSessionUser(req, res);
  if (!user || !isAdminOrCS(user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PUT') {
    const { title, description, content, categoryId } = req.body;

    if (!title || !content || !categoryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await prisma.post.update({
      where: { id: id as string },
      data: {
        title,
        description,
        content,
        categoryId,
        updatedBy: user.id,
      },
    });

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    await prisma.post.delete({
      where: { id: id as string },
    });
    return res.status(204).end();
  }

  return res.status(405).end();
}
