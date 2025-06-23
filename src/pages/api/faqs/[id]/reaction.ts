import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/utils/auth';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: postId } = req.query;
  const user = await getSessionUser(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { reactionType } = req.body as { reactionType: string };

    const existing = await prisma.reaction.findFirst({
      where: { postId: postId as string, userId: user.id },
    });

    if (existing) {
      await prisma.reaction.update({
        where: { id: existing.id },
        data: { reactionType, updatedBy: user.id },
      });
    } else {
      await prisma.reaction.create({
        data: {
          id: randomUUID(),
          postId: postId as string,
          userId: user.id,
          reactionType,
          createdBy: user.id,
        },
      });
    }
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    await prisma.reaction.deleteMany({
      where: { postId: postId as string, userId: user.id },
    });
    return res.status(204).end();
  }

  return res.status(405).end();
}
