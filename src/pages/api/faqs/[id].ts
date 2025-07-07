import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser, isAdminOrCS } from '@/lib/utils/auth';
import { prisma } from '@/config';

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
          take: 100,
          orderBy: { createdAt: 'desc' },
          include: {
            User: true,
          },
        },
        PostCategory: true,
        User: true,
      },
    });

    const user = await getSessionUser(req, res);

    if (!post) return res.status(404).json({ error: 'Not Found' });

    return res.status(200).json({
      ...post,
      currentUserId: user?.id || null,
      currentUserRole: user?.role || null,
    });
  }

  const user = await getSessionUser(req, res);
  if (!user || !isAdminOrCS(user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'PUT') {
    const { title, description, content, categoryId } = req.body;
    await prisma.post.update({
      where: { id: id as string },
      data: {
        title,
        description,
        content,
        updatedBy: user.id,
        PostCategory: {
          connect: { id: categoryId },
        },
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
