import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSessionUser } from '@/lib/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();
  const { cid } = req.query;
  const user = await getSessionUser(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const comment = await prisma.comment.findUnique({
    where: { id: cid as string },
  });

  if (!comment) return res.status(404).json({ error: 'Comment not found' });

  // Chỉ CS hoặc chủ comment mới được xóa/sửa
  const isCS = user.role?.toLowerCase() === 'cs';
  const isOwner = comment.userId === user.id;
  const canEdit = isCS || isOwner;
  if (!canEdit) return res.status(403).json({ error: 'Forbidden' });

  if (req.method === 'PUT') {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content' });

    await prisma.comment.update({
      where: { id: cid as string },
      data: {
        content,
        updatedBy: user.id,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    await prisma.comment.delete({
      where: { id: cid as string },
    });
    return res.status(204).end();
  }

  return res.status(405).end();
}
