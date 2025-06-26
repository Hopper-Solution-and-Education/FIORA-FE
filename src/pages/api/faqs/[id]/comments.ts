import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/utils/auth';
import { randomUUID } from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const user = await getSessionUser(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { content } = req.body;

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid content' });
    }

    const comment = await prisma.comment.create({
      data: {
        id: randomUUID(),
        postId: id as string,
        userId: user.id,
        content,
        createdBy: user.id,
        updatedAt: new Date(),
      },
    });

    return res.status(201).json(comment);
  }

  return res.status(405).end();
}
