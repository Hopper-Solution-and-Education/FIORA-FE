import type { NextApiRequest, NextApiResponse } from 'next';
import { getSessionUser } from '@/lib/utils/auth';
import { randomUUID } from 'crypto';
import { prisma } from '@/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const user = await getSessionUser(req, res);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'POST') {
    const { content, replyToUsername } = req.body as {
      content: string;
      replyToUsername?: string;
    };

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Invalid content' });
    }

    const finalContent = replyToUsername ? `@${replyToUsername}: ${content}` : content;

    const comment = await prisma.comment.create({
      data: {
        id: randomUUID(),
        postId: id as string,
        userId: user.id,
        content: finalContent,
        createdBy: user.id,
        updatedAt: new Date(),
      },
    });

    return res.status(201).json(comment);
  }

  return res.status(405).end();
}
